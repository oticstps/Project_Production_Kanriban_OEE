// components/Part_Dashboard/EmissionsAndCost.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaLeaf, FaMoneyBillWave } from 'react-icons/fa';

const EmissionsAndCost = ({ totalCO2, uniqueDays, totalCost }) => {
  return (
    <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px" }}>
      {/* CO2 Emissions Summary */}
      <Col md={6}>
        <Card className="text-center shadow-sm border-0 border-left-danger h-100">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="text-danger fs-5 mb-3">
              <FaLeaf className="me-2" />
              CO2 Emissions Summary
              <span className="d-block text-muted small">(CO2排出量サマリー)</span> {/* Japanese translation */}
            </Card.Title>
            <Row>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Monthly</p>
                  <span className="d-block text-muted small">(月間)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">{totalCO2.toLocaleString()} kg</h5>
                </div>
              </Col>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Daily Avg</p>
                  <span className="d-block text-muted small">(日平均)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">{uniqueDays > 0 ? (totalCO2 / uniqueDays).toFixed(2) : "0"} kg</h5>
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <p className="mb-0 text-muted small">Yearly</p>
                  <span className="d-block text-muted small">(年間)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">{(totalCO2 * 12).toLocaleString()} kg</h5>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {/* Cost Analysis */}
      <Col md={6}>
        <Card className="text-center shadow-sm border-0 border-left-warning h-100">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="text-warning fs-5 mb-3">
              <FaMoneyBillWave className="me-2" />
              Cost Analysis
              <span className="d-block text-muted small">(コスト分析)</span> {/* Japanese translation */}
            </Card.Title>
            <Row>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Monthly</p>
                  <span className="d-block text-muted small">(月間)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">Rp {(totalCost).toLocaleString()}</h5>
                </div>
              </Col>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Daily Avg</p>
                  <span className="d-block text-muted small">(日平均)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">Rp {uniqueDays > 0 ? Math.ceil(totalCost / uniqueDays).toLocaleString() : "0"}</h5>
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <p className="mb-0 text-muted small">Per kWh</p>
                  <span className="d-block text-muted small">(kWhあたり)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">Rp 2,093</h5>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EmissionsAndCost;