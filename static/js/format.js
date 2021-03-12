function format(inputText, images = []) {
  //Escape html
  inputText = inputText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  inputText = inputText.replace(
    /-=-([0-9]*)-=-/gms,
    (match, group1, offset, input_string) => {
      if (images[group1]) return "<img src='" + images[group1] + "'>";
      else return "-=-" + group1 + "-=-";
    }
  );
  inputText = inputText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  inputText = inputText.replace(/==(.*?)==/g, "<h1>$1</h1>");
  inputText = inputText.replace(/-=(.*?)=-/g, "<h2>$1</h2>");
  inputText = inputText.replace(/=-(.*?)-=/g, "<h3>$1</h3>");
  inputText = inputText.replace(/__(.*?)__/g, "<u>$1</u>");
  inputText = inputText.replace(/~~(.*?)~~/g, "<i>$1</i>");
  inputText = inputText.replace(/--(.*?)--/g, "<del>$1</del>");
  inputText = inputText.replace(
    /```([a-z]*)(.*?)```/gms,
    (match, group1, group2, offset, input_string) => {
      return (
        "<pre class='" +
        group1 +
        "'><code style='background-color: #535866; margin: 0;' class='" +
        group1 +
        "'>" +
        group2.trim() +
        "</code></pre>"
      );
    }
  );
  inputText = inputText.replace(/---/g, "<hr>");
  inputText = inputText.replace(/(?:\r\n|\r|\n)/g, "<br>");

  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>'
  );

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>'
  );

  return replacedText;
}

module.exports = { format };
