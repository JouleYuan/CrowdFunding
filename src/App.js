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
    let cnt = 1;
    await Promise.all(
      projects.map(async projectAddress => {
        const projectInstance = project(projectAddress);
        const projectInfo = await projectInstance.methods.getDetail().call({
          from: this.state.currentAccount,
        });
        projectInfo.contract = projectInstance;
        projectInfo.projectTarget_eth = web3.utils.fromWei(projectInfo.projectTarget) + 'eth';
        projectInfo.projectBalance_eth = web3.utils.fromWei(projectInfo.projectBalance) + 'eth';
        projectInfo.projectTotal_eth = web3.utils.fromWei(projectInfo.projectTotal) + 'eth';
        projectInfo.projectContribution_eth = web3.utils.fromWei(projectInfo.projectContribution) + 'eth';
        projectInfo.projectTarget += 'wei';
        projectInfo.projectBalance += 'wei';
        projectInfo.projectTotal += 'wei';
        projectInfo.projectContribution += 'wei';
        projectInfo.projectStartTime = new Date(Number(projectInfo.projectStartTime) * 1000).toLocaleString("en-GB");
        projectInfo.projectDeadline = new Date(Number(projectInfo.projectDeadline) * 1000).toLocaleString("en-GB");
        if(projectInfo.projectCompleteTime === "0") projectInfo.projectCompleteTime = '-';
        else projectInfo.projectCompleteTime = new Date(Number(projectInfo.projectCompleteTime) * 1000).toLocaleString("en-GB");
        if(projectInfo.projectEndTime === "0") projectInfo.projectEndTime = '-';
        else projectInfo.projectEndTime = new Date(Number(projectInfo.projectEndTime) * 1000).toLocaleString("en-GB");
        if(projectInfo.projectState === "0") projectInfo.projectState = 'Ongoing';
        else if(projectInfo.projectState === "1") projectInfo.projectState = 'Failed';
        else if(projectInfo.projectState === "2") projectInfo.projectState = 'Succeeded';
        else if(projectInfo.projectState === "3") projectInfo.projectState = 'Paidoff';
        projectInfo.key = cnt++;
        newProjectsInfo.push(projectInfo);
      })
    );
    this.setState({projectsInfo: newProjectsInfo});
  }

  createProject = async(title, description, duration, target) => {
    try{
      console.log('create a project');
      await crowdfunding.methods.createProject(
        title, description, duration, web3.utils.toWei(target.toString())
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

  contribute = async(index, amount) => {
    try{
      console.log('contribute');
      const projectContract = this.state.projectsInfo[index].contract;
      await projectContract.methods.contribute().send({
        from: this.state.currentAccount,
        value: web3.utils.toWei(amount, 'ether'),
        gas: '3000000',
      });
      alert('Contribution Succeeded');
    } catch(e) {
      console.log(e);
      alert('Contribution Failed');
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
                contribute={this.contribute}
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
