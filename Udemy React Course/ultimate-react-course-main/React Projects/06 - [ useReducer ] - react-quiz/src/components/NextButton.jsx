function NextButton({ dispatch, answer, index, numQuestions }) {
    if (answer === null) return null;

    const lastQuestion = index === numQuestions - 1;

    return (
        <button
            className="btn btn-ui"
            onClick={() =>
                dispatch({ type: lastQuestion ? "finish" : "nextQuestion" })
            }
        >
            {lastQuestion ? "Finish" : "Next"}
        </button>
    );
}

export default NextButton;