import "../styles/ImageUpload.css"
import AddAuction from "../pages/AddAuction";

const React = require('react')
export class Upload extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            file: null
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        });

    }


    render() {
        return (

            <div id="imageDiv">
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Zdjęcie</span>
                        <input type="file" onChange={this.handleChange}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <img className="responsive-img" id="uploadedImg" src={this.state.file}/>
            </div>

        );
    }
}
export default Upload;
