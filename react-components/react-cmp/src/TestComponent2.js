import { useState } from "react";

const TestComponent2 = (props) => {
  const bridge = props.bridgeEvent;
  const [counter, setCounter] = useState(0);

  const onClickHandler = (e) => {
    const newCounter = counter + 1;
    //create a new CustomEvent with custom informations to send as detail
    const clickEvent = new CustomEvent("onClickEvent", {
      detail: {
        counter: newCounter
      }
    });
    bridge.dispatchEvent(clickEvent);
    setCounter(newCounter);
  }
  return ( 
    <div>
      I'm the component 2
      <br />
      <button onClick={onClickHandler}>Click me !</button>
    </div>
  );
}

export default TestComponent2;