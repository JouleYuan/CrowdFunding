import React, {Component} from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Title', dataIndex: 'projectTitle', key: 'projectTitle' },
  { title: 'Target', dataIndex: 'projectTarget', key: 'projectTarget' },
  { title: 'Total', dataIndex: 'projectTotal', key: 'projectTotal' },
  { title: 'Your Contribution', dataIndex: 'projectContribution', key: 'projectContribution'},
  { title: 'Start Time', dataIndex: 'projectStartTime', key: 'projectStartTime' },
  { title: 'Deadline', dataIndex: 'projectDeadline', key: 'projectDeadline' },
  { title: 'State', dataIndex: 'projectState', key: 'projectState' },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: () => <a href="www.baidu.com">Contribute</a>,
  },
];
/*
const data = [
  {
    key: 1,
    projectTitle: 'project1',
    projectDescription: 'Help the poor',
    projectTarget: 20,
    projectStartTime: '2021.1.6 20:54:23',
    projectDeadline: '2021.1.6 20:54:23',
    projectCompleteTime: '2021.1.6 20:54:23',
    projectEndTime: '2021.1.6 20:54:23',
    projectBalance: 0,
    projectTotal: 0,
    projectContribution: 0,
    projectState: 'Ongoing',
  },
];
*/
class ProjectTable extends Component{
  render(){
    return (
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: record => <div>
              <p style={{ marginLeft: 30 }}>Title: {record.projectTitle}</p>
              <p style={{ marginLeft: 30 }}>State: {record.projectState}</p>
              <p style={{ marginLeft: 30 }}>Target Amount: {record.projectTarget} eth</p>
              <p style={{ marginLeft: 30 }}>Total Raised Amount: {record.projectTotal} eth</p>
              <p style={{ marginLeft: 30 }}>Fund Balance: {record.projectBalance} eth</p>
              <p style={{ marginLeft: 30 }}>Your Contribution: {record.projectContribution} eth</p>
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