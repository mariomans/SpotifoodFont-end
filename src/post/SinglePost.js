import React, { Component } from 'react';
import { singlePost, remove } from './apiPost'
import DefalutPost from '../images/adspace.jpg';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import FollowProfileButton from '../user/FollowProfileButton';

class SinglePost extends Component {
    constructor() {
        super()
        this.state = {
            user: { following: [], followers: [] },
            post: '',
            user: '',
            redirectToHome: false,
            following: false,
            error: ''
        }
    }

    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids(followers) and vice versa
            return follower._id === jwt.user._id
        });
        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data, following: !this.state.following })
                }
            })
    }


    componentDidMount = () => {
        const postId = this.props.match.params.postId;
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
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
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
        const posterId = post.postedBy ? post.postedBy._id : ""
        const posterName = post.postedBy ? post.postedBy.name : "Unknown"
        console.log(post.postedBy._id);
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
                    Posted by <Link to={`/user/${posterId}`}>{posterName}{" "}</Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <br />
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary mr-5">
                        Bact to posts
                    </Link>

                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id ? (
                        <>
                            <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning mr-5">
                                Edit post
                        </Link>
                            <button onClick={this.deleteConfirmed} to={`/`} className="btn btn-raised btn-danger">
                                Delete Post
                        </button>
                        </>
                    ) : (
                            <FollowProfileButton
                                following={this.state.following}
                                onButtonClick={this.clickFollowButton} />
                        )}
                </div>
                <br />
                <img
                    style={{ height: "150px", width: '300px', oubjectFit: "cover" }}
                    src={DefalutPost}
                />
                <div>
                    {isAuthenticated().user &&
                        isAuthenticated().user.role === "admin" && (
                            <div class="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-2 text-danger">
                                        Edit/Delete as an Admin
                    </p>
                                    <Link
                                        to={`/post/edit/${post._id}`}
                                        className="btn btn-raised btn-warning btn-sm mr-5"
                                    >
                                        Update Post
                    </Link>
                                    <button
                                        onClick={this.deleteConfirmed}
                                        className="btn btn-raised btn-danger"
                                    >
                                        Delete Post
                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </div>

        );

    };

    render() {

        if (this.state.redirectToHome) {
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