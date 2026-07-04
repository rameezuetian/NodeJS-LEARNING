const {nanoid} = require("nanoid");
const URL = require("../models/url")



async function handleGenerateNewShortUrl(req, res) {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url) {
        return res.status(400).json({ error: "url is required" });
    }

    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: url,
        visitHistory: [],
        createdBy: req.user ? req.user._id : null,
    });

    return res.json({ id: shortID });
}

async function handleGenerateAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGenerateAnalytics,
};