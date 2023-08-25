import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Row,
} from "reactstrap";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env);
    fetch("https://cri-crm-d5cd0ee5dc74.herokuapp.com/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (!data.error) {
          // Handle successful login
          navigate("/crm", { replace: true, state: data });
        } else {
          // Handle failed login
          alert("Invalid credentials");
          console.log("Invalid credentials");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Row className="d-flex justify-content-center mt-5 pt-5">
        <Col md="6">
          <Card>
            <CardHeader>
              <h4>CRM - Login</h4>
            </CardHeader>
            <CardBody>
              <Form
              //  action="https://cri-crm-d5cd0ee5dc74.herokuapp.com/auth"
              //method="POST"
              ></Form>
              Name :
              <Input
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
              Password :
              <Input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button onClick={handleSubmit}> Login</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
