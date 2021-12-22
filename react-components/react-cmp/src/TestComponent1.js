import { useEffect, useState } from "react";

const TestComponent1 = (props) => {
  const bridge = props.bridgeEvent;
  const [clickCounter, setClickCounter] = useState(0);
  const [eventCounter, setEventCounter] = useState(0);

  useEffect(() => {
    bridge.addEventListener("onClickEvent", function(e){
      setEventCounter(prevCounter => (prevCounter+1));
      setClickCounter(e.detail.counter);
    });
  }, [bridge]);

  return ( 
    <div>
      I'm the component 1 with attribute {props.testAttribute}
      <br />
      <strong>{eventCounter} events</strong> have been received.
      <br />
      The component's button has been clicked <strong>{clickCounter} times</strong>.
    </div>
  );
}

export default TestComponent1;