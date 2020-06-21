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
  ModalBody
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import { postJob } from "../api";


const CreateJob = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function onJobSubmit () {
    setLoading(true);
    postJob(url)
      .then(() => {
        setLoading(false);
        setMessage('Job has started.')
      })
      .catch(e => {
        setLoading(false);
        setMessage(`Job request failed: ${e.message}`)
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

        <Modal open={message !== null} toggle={() => setMessage(null)}>
          <ModalHeader>Alert</ModalHeader>
          <ModalBody>{message}</ModalBody>
        </Modal>

        <Row>
          <Col lg="8" className="mb-4">
            {/* Complete Form Example */}
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
