import React from 'https://esm.sh/react@18';
import { useSelector } from 'https://esm.sh/react-redux@9';
function Span() {
  const span = useSelector(state => state.form.values.budgetSpan);
  return /*#__PURE__*/React.createElement(React.Fragment, null, span);
}
export default Span;