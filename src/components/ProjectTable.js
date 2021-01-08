import React, {Component} from 'react';
import { Table, Tag } from 'antd';
import Contribute from './Contribute';
import CreateDraw from './CreateDraw';

class ProjectTable extends Component{
  constructor(){
    super();
    this.state = {
      columns: [],
    };
  }

  componentDidMount(){
    this.setState({
      columns: [
        { title: 'Title',
          dataIndex: 'projectTitle', 
          key: 'projectTitle',
          render: (text, record, index) => {
            const url = '/project/' + index;
            return (
              <a href={url}>{text}</a>
            );
          }
        },
        { title: 'Target', dataIndex: 'projectTarget_eth', key: 'projectTarget_eth' },
        { title: 'Total', dataIndex: 'projectTotal_eth', key: 'projectTotal_eth' },
        { title: 'Your Contribution', dataIndex: 'projectContribution_eth', key: 'projectContribution_eth'},
        { title: 'Start Time', dataIndex: 'projectStartTime', key: 'projectStartTime' },
        { title: 'Deadline', dataIndex: 'projectDeadline', key: 'projectDeadline' },
        { title: 'State', 
          dataIndex: 'projectState', 
          key: 'projectState',
          render: (text) => {
            let color = 'geekblue';
            if (text === "Ongoing") color = 'green';
            else if (text === "Failed") color = 'volcano';
            else if (text === "Succeeded") color = 'geekblue';
            else if (text === "Paidoff") color = 'gold';
            return (
              <Tag color={color} key={text}>
                {text}
              </Tag>
            );
          },
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record, index) => {
            if (this.props.currentAccount === record.projectCreator){
              if (record.projectState === "Ongoing") return (<></>);
              else if (record.projectState === "Failed") return (<></>);
              else if (record.projectState === "Succeeded") return (
                <CreateDraw
                  index={index}
                  createDraw={this.props.createDraw}
                ></CreateDraw>
              );
              else if (record.projectState === "Paidout") return (<></>);
            } else {
              if (record.projectState === "Ongoing") return (
                <Contribute
                  index={index}
                  contribute={this.props.contribute}
                ></Contribute>
              );
              else if (record.projectState === "Failed") return (<></>);
              else if (record.projectState === "Succeeded") return (<></>);
              else if (record.projectState === "Paidout") return (<></>);
            }
          },
        },
      ],
    });
  }

  render(){
    return (
      <Table
        columns={this.state.columns}
        expandable={{
          expandedRowRender: record => <div>
              <p style={{ marginLeft: 30 }}>Title: {record.projectTitle}</p>
              <p style={{ marginLeft: 30 }}>State: {record.projectState}</p>
              <p style={{ marginLeft: 30 }}>Target Amount: {record.projectTarget_eth} ({record.projectTarget})</p>
              <p style={{ marginLeft: 30 }}>Total Raised Amount: {record.projectTotal_eth} ({record.projectTotal})</p>
              <p style={{ marginLeft: 30 }}>Fund Balance: {record.projectBalance_eth} ({record.projectBalance})</p>
              <p style={{ marginLeft: 30 }}>Your Contribution: {record.projectContribution_eth} ({record.projectContribution})</p>
              <p style={{ marginLeft: 30 }}>Project Start Time: {record.projectStartTime}</p>
              <p style={{ marginLeft: 30 }}>Raising Deadline: {record.projectDeadline}</p>
              <p style={{ marginLeft: 30 }}>Raising Complete Time: {record.projectCompleteTime}</p>
              <p style={{ marginLeft: 30 }}>Project End Time: {record.projectEndTime}</p>
              <p style={{ marginLeft: 30 }}>Description: {record.projectDescription}</p>
            </div>,
        }}
        dataSource={this.props.projectsInfo}
      />
    )
  }
};

export default ProjectTable;