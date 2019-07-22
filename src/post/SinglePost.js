import React, { Component } from 'react';
import { singlePost , remove} from './apiPost'
import DefalutPost from '../images/dishes.jpg';
import { Link , Redirect} from 'react-router-dom';
import {isAuthenticated} from '../auth';

class SinglePost extends Component {
    state = {
        post: '',
        redirectToHome: false
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ post: data });
            }
        })
    }

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token
        remove(postId, token).then(data => {
            if(data.error){
                console.log(data.error);
            } else {
                this.setState({redirectToHome: true});
            }
        });
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your post?")
        if (answer) {
            this.deletePost();
        }
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/{post.postedBy._id}` : ""
        const posterName = post.postedBy ? post.postedBy.name : "Unknown"
        return (
            <div className="card-body">
                <img
                    style={{ height: "300px", width: 'auto', oubjectFit: "cover" }}
                    className="img-thumbnail mb-5"
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    onError={i => (i.target.src = `${DefalutPost}`)}
                    alt={post.title}
                />
                <p className="card-text"> {post.body} </p>
                <br />
                <p className="card-text"> {post.bodys} </p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName}{" "}</Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary mr-5">
                        Bact to posts
                    </Link>

                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                        <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning mr-5">
                        Edit post
                        </Link>
                        <button onClick={this.deleteConfirmed} to={`/`} className="btn btn-raised btn-danger">
                            Delete Post
                        </button> 
                        </>
                    )}
                </div>
            </div>
        );

    };

    render() {

        if(this.state.redirectToHome) {
            return <Redirect to={`/`} />;
        }
        const { post } = this.state;
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading ...</h2> </div>) : (this.renderPost(post))}

            </div>
        );
    }
}

export default SinglePost;