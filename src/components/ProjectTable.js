import React, {Component} from 'react';
import { Table, Modal, Button, Form, Input, InputNumber, Col, Row } from 'antd';

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

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
  whiteCol: {span: 1}
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    target: '${label} is not a valid email!',
    duration: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

class ProjectTable extends Component{
  showModal = (record) => {
    this.setState({
      visible: true,
      key: record.key,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      key: 0,
    });
  }

  onFinish = (values) => {
    console.log(values);
    this.props.contribute(this.state.key - 1, values.amount);
    this.setState({visible: false});
  };

  constructor(){
    super();
    this.state = {
      columns: [],
      visible: false,
      key: 0,
    };
  }

  componentDidMount(){
    this.setState({
      columns: [
        { title: 'Title', dataIndex: 'projectTitle', key: 'projectTitle' },
        { title: 'Target', dataIndex: 'projectTarget_eth', key: 'projectTarget_eth' },
        { title: 'Total', dataIndex: 'projectTotal_eth', key: 'projectTotal_eth' },
        { title: 'Your Contribution', dataIndex: 'projectContribution_eth', key: 'projectContribution_eth'},
        { title: 'Start Time', dataIndex: 'projectStartTime', key: 'projectStartTime' },
        { title: 'Deadline', dataIndex: 'projectDeadline', key: 'projectDeadline' },
        { title: 'State', dataIndex: 'projectState', key: 'projectState' },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (record) => <a onClick={()=>this.showModal(record)}>Contribute</a>,
        },
      ],
    });
  }

  render(){
    return (
      <div>
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
        <Modal
          title="Contribute"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width="50%"
          destroyOnClose="true"
        >
          <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages} preserve={false}>
            <Form.Item name={['amount']} label="Amount" rules={[{ pattern: '^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$', required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Row>
                <Col span={12}>
                  <Button onClick={this.handleCancel}>
                    取消
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
};

export default ProjectTable;