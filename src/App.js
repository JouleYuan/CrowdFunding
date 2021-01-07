import React, {Component} from 'react';
import './App.css';
import web3 from './utils/InitWeb3';
import crowdfunding from './eth/CrowdFunding';
import project from './eth/Project';
import { Layout, Menu } from 'antd';
import ProjectTable from './components/ProjectTable';
import CreateProject from './components/CreateProject';

const { Header, Content, Footer } = Layout;

class App extends Component{
  getProjects = async() => {
    console.log('get projects');
    const newProjectsInfo = [];
    const projects = await crowdfunding.methods.getProjects().call();
    console.log(projects);
    let cnt = 1;
    
    await Promise.all(
      projects.map(async projectAddress => {
        console.log(projectAddress);
        const projectInstance = project(projectAddress);
        const projectInfo = await projectInstance.methods.getDetail().call();
        projectInfo.contract = projectInstance;
        projectInfo.key = cnt++; 
        newProjectsInfo.push(projectInfo);
      })
    );
    console.log(newProjectsInfo);
    this.setState({projectsInfo: newProjectsInfo});
  }

  createProject = async(title, description, duration, target) => {
    try{
      console.log('create a project');
      await crowdfunding.methods.createProject(
        title, description, duration, target
      ).send({
        from: this.state.currentAccount,
        gas: '3000000',
      });
      alert('Creation Succeeded');
    } catch(e) {
      console.log(e);
      alert('Creation Failed');
    }
    this.getProjects();
  }

  constructor() {
    super();
    this.state = {
      currentAccount: '',
      projectsInfo: [],
      newProject: {},
    };
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({currentAccount: accounts[0]});
    this.getProjects();
  }

  render() {
    return (
      <div className="App">
        <Layout className="layout">
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} >
              <Menu.Item key="1">All Projects</Menu.Item>
              <Menu.Item key="2">My Projects</Menu.Item>
              <Menu.Item key="3">My Contributions</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <CreateProject
              currentAccount={this.state.currentAccount}
              createProject={this.createProject}
            ></CreateProject>
            <div className="site-layout-content">
              <ProjectTable
                projectsInfo={this.state.projectsInfo}
              ></ProjectTable>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Crowd Funding ©2021 Created by Yuan Haoran</Footer>
        </Layout>
      </div>
    )
  }
}

export default App;
