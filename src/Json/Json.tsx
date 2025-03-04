import { Textarea } from "../App.styled";

export const Json = () => {
  return (
    <Textarea
    value={`{
"5": {
"vector": "1000",
"inputs": ["r3", "r1"]
},
"6": {
"vector": "1000",
"inputs": ["r2", "r3"]
},
"7": {
"vector": "1000",
"inputs": ["r2", "r4"]
},
"8": {
"vector": "1000",
"inputs": ["r2", "5"]
},
"9": {
"vector": "1000",
"inputs": ["r1", "6"]
},
"10": {
"vector": "1000",
"inputs": ["6", "r4"]
},
"11": {
"vector": "1000",
"inputs": ["7", "r3"]
},
"12": {
"vector": "1000000000000000",
"inputs": ["8", "9", "10", "11"],
"is_output": true
}
}`}
  />
  );
}