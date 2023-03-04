import { MathJaxContext, MathJax } from "better-react-mathjax";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import "./index.css";

const questionIDsList = [
  "AreaUnderTheCurve_901",
  "BinomialTheorem_901",
  "DifferentialCalculus2_901",
];

const componentStatus = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "INPROGRESS",
};

const NioClass = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState({ Question: "", QuestionID: "" });
  const [status, setStatus] = useState(componentStatus.initial);
  const [open, setOpen] = useState(false);

  const fetchSuccessFunction = (data) => {
    const updatedQuetion = {
      Question: data[0].Question,
      QuestionID: data[0].QuestionID,
    };
    setQuestion(updatedQuetion);
    setStatus(componentStatus.success);
  };

  const getQuestions = async () => {
    setStatus(componentStatus.inProgress);
    const url = `https://0h8nti4f08.execute-api.ap-northeast-1.amazonaws.com/getQuestionDetails/getquestiondetails?QuestionID=${questionIDsList[index]}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      fetchSuccessFunction(data);
    } else {
      setStatus(componentStatus.failure);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [index]);

  const onClickNextButton = () => {
    if (index < questionIDsList.length - 1) {
      setIndex(index + 1);
    }
  };

  const onClickBackButton = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const renderSuccessView = () => {
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    return (
      <>
        <MathJaxContext>
          <MathJax>{question.Question}</MathJax>
        </MathJaxContext>
        <div className="align-self-end mt-5">
          <Button variant="contained" color="success" onClick={handleClickOpen}>
            Answer
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogContent>
              <DialogContentText>
                Sorry, No Answer is currently available.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </>
    );
  };

  const onClickRetryButton = () => {
    getQuestions();
  };

  const renderFailureView = () => (
    <Button variant="contained" onClick={onClickRetryButton}>
      Retry
    </Button>
  );

  const renderInProgressView = () => (
    <Loader type="TailSpin" height={50} width={50} color="blue" />
  );

  const decisionMaking = () => {
    switch (status) {
      case componentStatus.success:
        return renderSuccessView();
      case componentStatus.failure:
        return renderFailureView();
      case componentStatus.inProgress:
        return renderInProgressView();
      default:
        return null;
    }
  };

  const isDisabledBackButton = index <= 0 ? true : false;

  const isDisabledNextButton =
    index === questionIDsList.length - 1 ? true : false;

  return (
    <div className="parent_container">
      <div className="main_container p-3">
        <div className="p-3 parent_question_container">
          <div className="question_container">{decisionMaking()}</div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            variant="contained"
            onClick={onClickBackButton}
            disabled={isDisabledBackButton}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onClickNextButton}
            disabled={isDisabledNextButton}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NioClass;
