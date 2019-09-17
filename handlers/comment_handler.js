const YAML = require('yamljs');
const config = YAML.load('config.yaml');
const { Comments } = require('instagram-public-crawler');

module.exports = async (params) => {
    try {
        
        let _comments = new Comments({
            cookie: config.cookie,
        });

        let result = await _comments.getComments(params)

        // sanitize

        let comments = result.data.shortcode_media.edge_media_to_comment
        return comments;

    } catch (error) {
        throw error;
    }
}