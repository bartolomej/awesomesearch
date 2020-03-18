import Document from "./document";


export default class ListItem extends Document {

  constructor (title, url, description) {
    super(title);
    this.url = url;
    this.description = description;
  }


}
