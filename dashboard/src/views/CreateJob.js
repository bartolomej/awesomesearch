import React from "react";
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
  Row
} from "shards-react";

import PageTitle from "../components/common/PageTitle";


const CreateJob = () => (
  <div>
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Jobs"
          className="text-sm-left"
        />
      </Row>

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
                    <Form>
                      <FormGroup>
                        <label htmlFor="feInputAddress">Github
                          repository</label>
                        <FormInput id="feInputAddress"
                                   placeholder="Place url here ..."/>
                      </FormGroup>

                      <Button type="submit">Start indexing</Button>
                    </Form>
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

export default CreateJob;
