import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Navbar,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";

const Booking = () => {
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState("");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [deleteResponseModal, setDeleteResponseModal] = useState(false);
  const location = useLocation();
  const data = location.state;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [saved, setSaved] = useState(false);
  const [appointmentData, setAppointmentData] = useState("");
  const [appointmentDataFilter, setAppointmentDataFilter] = useState("");
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const Today = formatDate(new Date());

  const getAppointments = () => {
    axios
      .get("http://localhost:8000/appointments", {
        params: { date: `${formatDate(selectedDate)}` },
        headers: {
          Authorization: `Bearer ${data.token && data.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setAppointmentData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log(data);
    if (data.token) {
      getAppointments();
    }
    console.log(data);
  }, [selectedDate]);

  useEffect(() => {
    if (appointmentData && data.otData) {
      const appDataFilter = appointmentData.filter(
        (item) => item.mrn === data.otData.mrn
      );
      setAppointmentDataFilter(appDataFilter);
      console.log(appointmentData);
    }
  }, [appointmentData, data]);

  const bookingHandler = () => {
    if (formatDate(selectedDate) < Today) {
      alert("Please select future date");
    } else if (
      appointmentDataFilter.length &&
      data.mrn === appointmentDataFilter[0].mrn &&
      formatDate(selectedDate) === appointmentDataFilter[0].appointmentdate
    ) {
      alert("Appointment already taken on the same date");
    } else {
      axios
        .post("http://localhost:8000/add-appointment", {
          mrn: data.otData.mrn,
          date: formatDate(selectedDate),
          time: selectedTime,
          doctor: selectedDoctor,
        })
        .then((res) => {
          console.log(res);
          setSaved(true);
          getAppointments();
        })
        .catch((err) => alert(err.message));
    }
  };
  const appointmentHandler = (mrn) => {
    const cdata = data.customerData;
    if (cdata.filter((item) => item.mrn === mrn)) {
      const [v] = cdata.filter((item) => item.mrn === mrn);
      console.log(v);
      return v;
    }

    if (appointmentData.filter((item) => item.mrn === mrn)) {
      console.log(appointmentData.filter((item) => item.mrn === mrn));
    }
  };
  const deleteAppointmentHandler = (date, id) => {
    setDeleteResponseModal(true);
    axios
      .delete("http://localhost:8000/delete-appointment", {
        params: { date: date, id: id },
        headers: {
          Authorization: `Bearer ${data.authData && data.authData.token}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log(res);
          axios
            .get("http://localhost:8000/appointments", {
              params: { date: `${formatDate(selectedDate)}` },
              headers: {
                Authorization: `Bearer ${data.authData && data.authData.token}`,
              },
            })
            .then((res) => {
              console.log(res);
              setAppointmentData(res.data);
            })
            .catch((err) => console.log(err));
        }
      });
  };

  return (
    <Container>
      <div className="p-3 bg-info my-2 rounded d-flex justify-content-center">
        <h5>OT Schedule and Booking</h5>
      </div>
      <Row>
        <Col md="1" className="pb-4">
          <Button outline onClick={() => navigate("/crm")}>
            Back
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={3} className="react-calendar">
          <div className="p-3 bg-info my-2 rounded">
            <Toast>
              <ToastHeader>
                <h6>Appointment</h6>
              </ToastHeader>
              {data && data.otData && (
                <ToastBody>
                  Cutsomer Name: {data && data.otData.fname}{" "}
                  {data && data.otData.sname} <br />
                  MRN : {data && data.otData.mrn} <br />
                  Treatment : {data && data.otData.treatmenttype} <br />
                  Contact No: {data && data.otData.contactno} <br />
                  Date:{selectedDate && formatDate(selectedDate)} <br />
                  Time:{" "}
                  <Input
                    type="time"
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                  <br />
                  Doctor Name:{" "}
                  <Input
                    type="text"
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                  />
                </ToastBody>
              )}
              {data && data.otData && (
                <div className="d-flex justify-content-end p-1">
                  <Button
                    size="sm"
                    onClick={bookingHandler}
                    // style={{ display: saved ? "none" : "" }}
                  >
                    Book
                  </Button>
                </div>
              )}
            </Toast>
            {appointmentData &&
              appointmentData.map((app) => {
                const currentDateWithoutTime = new Date();
                currentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight

                const appointmentDateWithoutTime = new Date(
                  app.appointmentdate
                );
                appointmentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight
                if (data.otData && data.otData.mrn === app.mrn) {
                  return (
                    <Toast>
                      <Fragment>
                        <ToastHeader>
                          {" "}
                          Customer Name:{" "}
                          <div>
                            {data.otData.fname} {data.otData.sname} <br />
                            MRN : {app.mrn} <br />
                            Treatment : {data.otData.treatmenttype} <br />
                            Contact No: {data.otData.contactno} <br />
                            Date:{app.appointmentdate} <br />
                            Time: {app.time}
                            <br />
                            Doctor Name: {app.doctor}
                          </div>
                        </ToastHeader>
                        <div className="d-flex justify-content-end p-1">
                          {appointmentDateWithoutTime >=
                            currentDateWithoutTime && (
                            <Button size="sm" onClick={bookingHandler}>
                              Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() =>
                              deleteAppointmentHandler(
                                app.appointmentdate,
                                app._id
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </Fragment>
                    </Toast>
                  );
                }
              })}
          </div>
        </Col>
        <Col>
          <Calendar
            formatLongDate={(locale, date) => formatDate(date, "YYYY-MMM-dd")}
            onChange={(e) => {
              console.log(e);
              setSelectedDate(e);
              //toggle();
            }}
          />
        </Col>
        <Col>
          {appointmentData &&
            appointmentData.map((app) => {
              const currentDateWithoutTime = new Date();
              currentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight

              const appointmentDateWithoutTime = new Date(app.appointmentdate);
              appointmentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight
              if (data.otData && data.otData.mrn !== app.mrn) {
                const cm = appointmentHandler(app.mrn);
                return (
                  <Toast>
                    <ToastHeader>
                      {cm.fname} {cm.sname}
                    </ToastHeader>
                    <ToastBody>
                      {
                        <div>
                          MRN : {app.mrn} <br />
                          Treatment : {cm.treatmenttype} <br />
                          Contact No: {cm.contactno} <br />
                          Date:{app.appointmentdate} <br />
                          Time: {app.time}
                          <br />
                          Doctor Name: {app.doctor}
                        </div>
                      }
                    </ToastBody>
                  </Toast>
                );
              }
            })}
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>
          <h5>{"Book Appointment"}</h5>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Label sm="4">Customer Name</Label>
            <Col md="6">
              <Input
                type="select"
                onChange={(e) => {
                  setBookingDate(e.target.value);
                }}
              ></Input>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Booking;
