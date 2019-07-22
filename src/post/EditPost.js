import React, { Component } from 'react';
import { singlePost, update } from './apiPost';
import { isAuthenticated } from '../auth';
import { Redirect } from "react-router-dom";
import DefalutPost from '../images/dishes.jpg';

class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            body: '',
            bodys: '',
            redirectToProfile: false,
            error: '',
            fileSize: 0,
            loading: false
        }
    }

    init = postId => {
        const token = isAuthenticated().token;
        singlePost(postId, token)
            .then(data => {
                if (data.error) {
                    console.log({ redirectToProfile: true });
                } else {
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        bodys: data.bodys,
                        error: '',
                    });
                }
            });
    };

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize } = this.state
        if (fileSize > 100000) {
            this.setState({ error: "File size should be less than 100kb" , loading: false});
            return false
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false })
            return false
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value = name === 'photo' ? event.target.files[0] : event.target.value;

        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {

            const postId = this.state.id
            const token = isAuthenticated().token;
            update(postId, token, this.postData)
                .then(data => {
                    if (data.error) this.setState({ error: data.error });
                    else
                        this.setState({
                            loading: false,
                            title: '',
                            body: '',
                            bodys: '',
                            redirectToProfile: true
                        });
                });
        }
    };

    editPostForm = (title, body, bodys) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control"></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Name of dish</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Ingredient</label>
                <textarea onChange={this.handleChange("body")} type="text" className="form-control" value={body}></textarea>
            </div>
            <div className="form-group">
                <label className="text-muted">How to cook</label>
                <textarea onChange={this.handleChange("bodys")} type="text" className="form-control" value={bodys}></textarea>
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
                Edit Post
            </button>
        </form>
    );

    render() {
        const { id, title, body, redirectToProfile, error, loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }
        return (
            <div className="container">
                <h3 className="mt-5 mb-5">{title}</h3>

                <div className="alert alert-danger" style={{ display: error ? "" : 'none' }}>{error}</div>
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading ...</h2> </div>) : ("")}


                <img
                    style={{ height: "200px", width: 'auto' }}
                    className="img-thumbnail"
                    onError={i => (i.target.src = `${DefalutPost}`)}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`}
                    alt={title}
                />

                {this.editPostForm(title, body)}
            </div>
        )
    }
}

export default EditPost;