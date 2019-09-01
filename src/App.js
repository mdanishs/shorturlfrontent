import React, { Component } from 'react';
import { Container, Col, Row, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import './App.css';
import { getShortenUrl, getFullUrl } from './ApiHelper';

class App extends Component {

  state = {
    shortUrl: ""
  }

  componentDidMount() {
    this.checkForUrl();
  }

  createCompleteUrl = () => window.location.origin + "/" + this.state.shortUrl;

  checkForUrl = () => {
    let url = this.props.match.params['shorturl'];
    if (url) {
      getFullUrl(url)
        .then(res => {
          window.location.replace(res.data.url);
        })
        .catch(
          err => {
            this.setState({
              error: err.response.data.message
            })
          }
        )
    }
  }

  handleOnClick = () => {
    window.location.href = this.createCompleteUrl();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    getShortenUrl(e.target.url.value)
      .then(res => {
        this.setState({
          error: "",
          shortUrl: res.data.url
        })
      }).catch(err => {
        this.setState({
          shortUrl: "",
          error: err.response.data.message
        })
      })
  }

  render() {
    const { shortUrl, error } = this.state;
    return (
      <div className="App" >
        <Container>
          <Row>
            <Col md={6} className="mx-auto text-center">
              <h1>URL Shortner</h1>
              <Form onSubmit={this.handleSubmit}>
                <InputGroup>
                  <Form.Control required name='url' placeholder="Enter url to shorten" />
                  <InputGroup.Append>
                    <Button type="submit">Shorten</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
              {shortUrl && <Button onClick={this.handleOnClick} className="short-url" variant="link">{this.createCompleteUrl()}</Button>}
              {error && <Alert className="mt-4" variant="danger">{error}</Alert>}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
