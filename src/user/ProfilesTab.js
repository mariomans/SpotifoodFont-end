import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from "../images/avatar.jpg";

class ProfileTabs extends Component {
    render() {
        const { posts, following, followers } = this.props;
        return (
            // <div className="row">
            //     <div className="col-md-4">
            //         <h3 className="text-primary">Posts</h3>
            //         <hr />
            //         {posts.map((post, i) => (
            //             <div key={i}>
            //                 <div>
            //                     <Link to={`/post/${post._id}`}>
            //                         <div>
            //                             <p className="lead">
            //                                 {post.title}
            //                             </p>
            //                         </div>
            //                     </Link>
            //                  </div>
            //             </div>
            //                     ))}
            //     </div>
            // </div>

            <div>
                <div>
                    following
                    {JSON.stringify(following)}
                </div>
                <div>
                    followers
                    {JSON.stringify(followers)}
                </div>
                <div>
                    posts
                    {JSON.stringify(posts)}
                </div>
            </div>

        )
    }
}

export default ProfileTabs;