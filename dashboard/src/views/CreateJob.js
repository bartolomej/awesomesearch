import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  FormInput,
  ListGroup,
  ListGroupItem,
  Row,
  Modal,
  ModalHeader,
  ModalBody, Alert
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import { postJob } from "../api";


const CreateJob = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function onJobSubmit () {
    setLoading(true);
    postJob(url)
      .then(() => {
        setLoading(false);
        setMessage('Job has started.')
      })
      .catch(e => {
        setLoading(false);
        setError(e)
      });
  }

  return (
    <div>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Jobs"
            className="text-sm-left"
          />
        </Row>

        {error && (
          <Alert theme="danger">
            Error occurred: {error.message.toLowerCase()}
          </Alert>
        )}

        {message && (
          <Alert theme="success">
            Job started
          </Alert>
        )}

        <Row>
          <Col lg="8" className="mb-4">
            <Card small>
              <CardHeader className="border-bottom">
                <h6 className="m-0">Create List Job</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <>
                        <FormGroup>
                          <label htmlFor="feInputAddress">Github
                            repository</label>
                          <FormInput
                            onChange={e => setUrl(e.target.value)}
                            id="feInputAddress"
                            placeholder="Place url here ..."
                          />
                        </FormGroup>

                        <Button onClick={onJobSubmit} type="submit">
                          {isLoading ? 'Posting ...' : 'Start indexing'}
                        </Button>

                        <a style={{ marginLeft: 20}} target="_blank" href="https://api.awesomesearch.in/admin/queue">
                          Go to queue dashboard
                        </a>
                      </>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateJob;
