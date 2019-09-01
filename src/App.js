import React, { Component, createRef } from 'react';
import { Container, Col, Row, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import './App.css';
import { getShortenUrl, getFullUrl } from './ApiHelper';

class App extends Component {

  state = {
    shortUrl: "",
    isCopiedToClipboard: false,
    isLoading: false
  }

  constructor(props) {
    super()
    this.buttonRef = createRef();
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
    this.buttonRef.current.select();
    document.execCommand('copy');
    this.setState({
      isCopiedToClipboard: true
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
      isCopiedToClipboard: false
    })
    getShortenUrl(e.target.url.value)
      .then(res => {
        this.setState({
          error: "",
          shortUrl: res.data.url,
          isLoading: false
        })
      }).catch(err => {
        this.setState({
          shortUrl: "",
          error: err.response.data.message,
          isLoading: false
        })
      })
  }

  render() {
    const { shortUrl, error, isCopiedToClipboard, isLoading } = this.state;
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
                    <Button type="submit" disabled={isLoading}>Shorten</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
              {shortUrl && <input readOnly ref={this.buttonRef} onClick={this.handleOnClick} className="btn btn-link short-url" value={this.createCompleteUrl()}/>}
              {error && <Alert className="mt-4" variant="danger">{error}</Alert>}
              {isCopiedToClipboard && <div className="text-muted"><small>Copied to clipboard</small></div>}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
