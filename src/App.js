import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    //#1 --> cases 4 /4
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    //#2
    case ACTIONS.CLEAR:
      return {};
    //#3 -- > 4 cases/4
    case ACTIONS.CHOOSE_OPERATION:
      //if nothing typed out yet then:
      if (state.previousOperand === null && state.currentOperand === null)
        return state;

      //if there is no second number
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          currentOperand: null,
          previousOperand: state.currentOperand,
        };
      }

      //If we want to change out operation, and we dont have second number typed out yet
      if (state.currentOperand == null)
        return {
          ...state,
          operation: payload.operation,
        };

      return {
        ...state,
        currentOperand: null,
        operation: payload.operation,
        previousOperand: evaluate(state),
      };

    //#4
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousOperand == null ||
        state.currentOperand == null
      )
        return state;

      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true,
      };

    //#5
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          operation: null,
          overwrite: false,
        };

      if (state.currentOperand == null) return state;

      //when you are deleting single digit, we want our currentOperand to be null insead of empty string
      if (state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: null,
        };

      //need to delete from 1234
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    //#4default
    default:
      return {};
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  //Fractional digits are a number of digits after the decimal separator ( . )
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ operation, previousOperand, currentOperand, overwrite }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      return;
  }
  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>

      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>

      <OperationButton operation={"÷"} dispatch={dispatch} />

      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />

      <OperationButton operation={"*"} dispatch={dispatch} />

      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />

      <OperationButton operation={"+"} dispatch={dispatch} />

      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />

      <OperationButton operation={"-"} dispatch={dispatch} />

      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
