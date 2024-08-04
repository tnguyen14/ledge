import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
function Span() {
  const span = useSelector(state => state.form.values.budgetSpan);
  return /*#__PURE__*/React.createElement(React.Fragment, null, span);
}
export default Span;