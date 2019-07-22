import React, { Component } from 'react';
import { list } from "./apiPost";
import DefalutPost from '../images/dishes.jpg';
import { Link } from 'react-router-dom';
class Posts extends Component {
    constructor() {
        super()
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ posts: data });
            }
        });
    }
    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                        const posterId = post.postedBy ? post.postedBy._id: ""
                        const posterName = post.postedBy ? post.postedBy.name: "Unknown"
                        return (
                        <div className="card col-md-4" key={i}>
                            <img style={{ height: "200px", width: '100%' }}
                            className="img-thumbnail"
                            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                            onError={i => (i.target.src = `${DefalutPost}`)}
                            alt={post.title}
                        />
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text"> {post.body.substring(0, 20)} </p>
                                <br/>
                                <p className="font-italic mark">
                                    Posted by <Link to={`/user/${posterId}`}>{posterName}{" "}</Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <Link
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-primary btn-sma" 
                                    > 
                                    Read more
                            </Link>
                            </div>
                        </div>
                        );
                    })};
            </div>
        );
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{!posts.length ? 'Loading...' : 'Recent Posts'} </h2>

                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;
