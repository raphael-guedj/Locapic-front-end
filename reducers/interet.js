export default function (interet = [], action) {
  if (action.type === "interetadd") {
    return action.interet;
  } else {
    return interet;
  }
}
