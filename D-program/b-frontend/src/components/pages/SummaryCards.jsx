import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  FaBolt, 
  FaChartLine, 
  FaLeaf, 
  FaMoneyBillWave, 
  FaClock, 
  FaArrowUp, 
  FaTachometerAlt, 
  FaCheck 
} from 'react-icons/fa';

const SummaryCards = ({ 
  totalConsumption, 
  averageDailyConsumption, 
  uniqueDays, 
  totalCO2, 
  totalCost, 
  avgShift1, 
  avgShift2, 
  shift1Percent, 
  shift2Percent, 
  maxShiftValue, 
  efficiencyRatio, 
  selectedMonth 
}) => {
  
  const getShiftComparisonStatus = () => {
    if (efficiencyRatio < 0.9) return { text: "Shift 1 Efficient", variant: "success", icon: <FaCheck /> };
    if (efficiencyRatio > 1.1) return { text: "Shift 2 Efficient", variant: "success", icon: <FaCheck /> };
    return { text: "Balanced", variant: "info", icon: <FaCheck /> };
  };

  return (
    <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px"  }}>
      {/* First Row */}
      <Col md={2}>
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-primary fs-5 mb-0 d-flex align-items-center">
                <FaBolt className="me-1" /> Total Energy
              </Card.Title>
              <span className="text-muted fs-7">(総エネルギー)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {totalConsumption.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={2}>
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-warning fs-5 mb-0 d-flex align-items-center">
                <FaMoneyBillWave className="me-1" /> Cost
              </Card.Title>
              <span className="text-muted fs-7">(コスト)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              Rp {totalCost.toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2}>
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-success fs-5 mb-0 d-flex align-items-center">
                <FaChartLine className="me-1" /> Avg Daily
              </Card.Title>
              <span className="text-muted fs-7">(平均日次)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {averageDailyConsumption.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>


      {/* Second Row */}
      <Col md={2} className="mt-2">
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-secondary fs-5 mb-0 d-flex align-items-center justify-content-center">
                <FaClock className="me-1" /> Shift 1 Avg
              </Card.Title>
              <span className="text-muted fs-7">(シフト1 平均)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {avgShift1.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="mt-2">
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-secondary fs-5 mb-0 d-flex align-items-center justify-content-center">
                <FaClock className="me-1" /> Shift 2 Avg
              </Card.Title>
              <span className="text-muted fs-7">(シフト2 平均)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {avgShift2.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="mt-2">
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-secondary fs-5 mb-0 d-flex align-items-center justify-content-center">
                <FaArrowUp className="me-1" /> Peak Value
              </Card.Title>
              <span className="text-muted fs-7">(ピーク値)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {maxShiftValue.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

    </Row>
  );
};

export default SummaryCards;