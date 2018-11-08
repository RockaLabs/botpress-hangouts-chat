import React from 'react';
import { Button, Container, Form } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

class HangoutsChatModule extends React.Component {
  state = {
    clientEmail: '',
    privateKey: '',
    verificationToken: ''
  };

  constructor(props) {
    super(props);
    this.fetchConfig = this.fetchConfig.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.setConfigValueInState = this.setConfigValueInState.bind(this);
  }

  componentDidMount() {
    this.fetchConfig();
  }

  fetchConfig() {
    fetch('/api/botpress-hangouts-chat/config')
      .then(res => res.json())
      .then(config => {
        console.log(
          '----------- Debugging circular JSON --> fetchConfig ------------'
        );
        console.log(config);
        return this.setState(config);
      });
  }

  setConfig() {
    console.log(
      '----------- Debugging circular JSON --> setConfig ------------'
    );
    console.log(this.state);
    fetch('/api/botpress-hangouts-chat/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(this.state)
    }).then(res => {
      if (res.status === 401) {
        alert('Something went wrong authenticating, check your credentials');
      } else {
        alert('You can now send messages :)');
      }
    });
  }

  setConfigValueInState(e, { name, value }) {
    if (!(name in this.state)) return;
    this.setState({ [name]: value });
  }

  render() {
    const { clientEmail, privateKey, verificationToken } = this.state;

    return (
      <Container>
        <Form onSubmit={this.setConfig}>
          <Form.Field>
            <label>Client email</label>
            <Form.Input
              value={clientEmail}
              name="clientEmail"
              onChange={this.setConfigValueInState}
            />
          </Form.Field>
          <Form.Field>
            <label>Private key</label>
            <Form.Input
              value={privateKey}
              name="privateKey"
              onChange={this.setConfigValueInState}
            />
          </Form.Field>
          <Form.Field>
            <label>Verification token</label>
            <Form.Input
              value={verificationToken}
              name="verificationToken"
              onChange={this.setConfigValueInState}
            />
          </Form.Field>
          <Button primary type="submit">
            Authorize
          </Button>
        </Form>
      </Container>
    );
  }
}

export default HangoutsChatModule;
