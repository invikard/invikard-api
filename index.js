const Koa = require('koa');
const Router = require('koa-router');
const YAML = require('yamljs');
const config = YAML.load('config.yaml');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
const router = new Router();
const apiHandler = require('./handlers/api_handler');
const parseHandler = require('./handlers/parse_handler');
const commentHandler = require('./handlers/comment_handler');

router.get('/:igname', async (ctx, next) => {
    if (ctx.request.headers['x-api-key'] === config.x_api_key && ctx.params.igname) {

        try {
            // check reserve
            if (ctx.params.igname === 'comments') {
                const { shortcode, first, after } = ctx.request.query;
                if(!shortcode || !first ){
                    ctx.throw("parameter not complete", 401);
                }

                let result = await commentHandler(ctx.request.query);
                ctx.body = result;

            } else {
                let resp = await apiHandler(ctx.params.igname, ctx);
                let parsed = await parseHandler(resp);
                ctx.body = parsed;
            }
        } catch (error) {
            console.log(error);
            ctx.status = 401;
            ctx.body = {
                statusCode: 500,
                message: error.message || "Unkown server error"
            }
        }
    } else {
        ctx.status = 401;
        ctx.body = {
            statusCode: 401,
            message: "You are not allowed to access this resource"
        }
    }
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);