import React, {Component} from 'react';
import { Modal, Button, Form, Input, InputNumber, Col, Row } from 'antd';

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

class CreateProject extends Component{
  showModal = () => {
    this.setState({visible: true});
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  onFinish = (values) => {
    console.log(values);
    this.props.createProject(values.title, values.description, values.duration, values.target);
    this.setState({visible: false});
  };

  constructor() {
    super();
    this.state = {
      visible: false,
    }
  }

  render(){
    return (
      <div style={{ margin: '16px 0' }}>
        <Button type="primary" onClick={this.showModal}>
          Create Project
        </Button>
        <Modal
          title="Create Project"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width="50%"
          destroyOnClose="true"
        >
          <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages} preserve={false}>
            <Form.Item name={['title']} label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['target']} label="Target(eths)" rules={[{ type: 'number', min: 0, required: true}]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={['duration']} label="Duration(days)" rules={[{ type: 'number', min: 0, max: 999, required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={['description']} label="Description" >
              <Input.TextArea rows={8}/>
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
    );
  }
}

export default CreateProject;