const YAML = require('yamljs');
const config = YAML.load('config.yaml');
const crawler = require('instagram-public-crawler');

module.exports = async (igName) => {
    //console.log(igName);
    try {
        let options = {
            raw: true,
            username: igName,
            query_hash: config.query_hash,
            media_count: -1,
            cookie: config.cookie,
            debug: true
        }

        let profile = await crawler.getProfileByLogged(options);
        //sanitize
        profile = {
            id: profile.graphql.user.id,
            fullname: profile.graphql.user.full_name,
            is_private: profile.graphql.user.is_private,
            avatar: profile.graphql.user.profile_pic_url_hd,
            username: profile.graphql.user.username,
            biography: profile.graphql.user.biography,
            link: profile.graphql.user.external_url,
            is_following: profile.graphql.user.follows_viewer
        };

        if (profile.is_private) throw new Error("Account is private");

        let _configs = profile.biography.split(" ");
        let htconfigs = [];
        _configs.map(c => {
            if (c.includes('#')) htconfigs.push(c);
        });

        let configs = {};

        htconfigs.map(ht => {
            if (ht === '#invikard') {
                configs.key = ht;
            }
            if (ht === '#wedding') {
                configs.type = ht;
            }
            if (ht === '#1') {
                configs.theme = ht;
            }
        });

        if (configs.key && configs.type && configs.theme)
            console.log("profile is valid")
        else throw new Error("Account is not valid with Invikard configuration");

        // start crawling media
        let media = await crawler.start(options);

        media = media.data.user.edge_owner_to_timeline_media.edges;

        

        // sanitize
        let nodes = [];
        for (let i = 0; i < media.length; i++) {
            let node = {
                image: media[i].node.display_url,
                caption: (media[i].node.edge_media_to_caption.edges.length > 0) ?
                    media[i].node.edge_media_to_caption.edges[0].node.text.replace("\n", " \n") : "No Caption",
                shortcode: media[i].node.shortcode,
                location: media[i].node.location,
                tagged_user: media[i].node.edge_media_to_tagged_user,
                comments: media[i].node.edge_media_to_comment
            }

            nodes.push(node);
        }

        return {
            profile,
            nodes
        };


    } catch (error) {
        throw error;
    }
}