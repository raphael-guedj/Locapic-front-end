export default function (pseudo = "", action) {
  if (action.type === "savePseudo") {
    var newPseudo = action.pseudo;
    // console.log("store", newPseudo);
    return newPseudo;
  } else {
    return pseudo;
  }
}
