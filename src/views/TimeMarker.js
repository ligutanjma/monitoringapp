import React, { Component } from "react";

export default class TimeMarker extends Component {
    render() {
        return (
            <div >
                <button className="btn btn-primary m-2" > Add Marker </button>
                <button className="btn btn-primary m-2" > Start Burner </button>
                <button className="btn btn-primary m-2"> Start Water </button>
                <button className="btn btn-primary m-2"> Done </button>
            </div>
        );
    }
}
