import { GridValueGetterParams } from "@mui/x-data-grid/models";
import { render, screen, cleanup } from "@testing-library/react";
import Absence from "../components/absence-list";

test("should render the component", () => {
  render(<Absence />);
  const absenceElement = screen.getByTestId("absence-test-1");
});
export {};

test("period calculator test",()=>{
  
})
