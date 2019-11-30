import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefalutProfrile from '../images/dishes.jpg';

class Similartab extends Component {
    render() {
        const { similar} = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-primary">{similar.length}Similar dish</h3>
                        <hr />
                        {similar.map((post, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/post/${post._id}`}>
                                    <img
                                            style={{
                                                borderRadius: "50%",
                                                border: "1px solid black"
                                            }}
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                            onError={i =>(i.target.src = `${DefalutProfrile}`)}
                                            alt={post.title}
                                        />
                                        <div>
                                            <p className="lead">{post.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        );
    }
}

export default Similartab;
