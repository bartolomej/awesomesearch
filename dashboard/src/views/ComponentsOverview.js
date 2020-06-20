import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Alert
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import CompleteFormExample from "../components/components-overview/CompleteFormExample";

const ComponentsOverview = () => (
  <div>
    <Container fluid className="px-0">
      <Alert className="mb-0">
        <i className="fa fa-info mx-2"></i> How you doin'? I'm just a friendly, good-looking notification message and I come in all the colors you can see below. Pretty cool, huh?
      </Alert>
    </Container>
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Forms & Components"
          subtitle="Overview"
          className="text-sm-left"
        />
      </Row>

      <Row>
        <Col lg="8" className="mb-4">
          {/* Complete Form Example */}
          <Card small>
            <CardHeader className="border-bottom">
              <h6 className="m-0">Form Example</h6>
            </CardHeader>
            <CompleteFormExample />
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default ComponentsOverview;
