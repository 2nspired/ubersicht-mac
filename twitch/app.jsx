// -------------------------------------------------------------
// twitch-app-jsx
// -------------------------------------------------------------
// Monitor your twitch followers and subscription counts

import { createContext, useState } from "react";
import { css, styled } from "uebersicht";

export const refreshFrequency = 1000 * 60 * 15; // time in ms

// TWITCH AUTH TOKEN: Implicit Grant Flow
// https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow

export function getTwitchAuthToken() {
  const twitchClientId = "7xeq1kpqvpqb2mxavsb1yc46hq4ozs";
  const twitchRedirectUri = "http://localhost:3000";
  const twitchScope = "moderator%3Aread%3Afollowers";
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&${twitchClientId}&redirect_uri=${twitchRedirectUri}&scope=${twitchScope}`;

  window.location.href = twitchAuthUrl;

  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));

    if (params.has("access_token")) {
      const twitchAuthToken = params.get("access_token");
      localStorage.setItem("twitchAuthToken", twitchAuthToken);
    } else if (params.has("error")) {
      const error = params.get("error");
      const errorDescription = params.get("error_description");
      console.error(`${error}: ${errorDescription}`);
    } else {
      console.error(`An unknown error occured ${error}`);
    }
  }
}

//TWITCH API: Get Channel Follows
// https://dev.twitch.tv/docs/api/reference/#get-channel-followers

export function getTwitchChannelFollows(twitchAuthToken, twitchClientId) {
  const twitchBroadcasterId = "Frozair";
  const twitchUserId = "TwinkieHesit";
  const twitchApiUrl = `https://api.twitch.tv/helix/channels/followers${twitchBroadcasterId}&${twitchUserId}`;

  fetch(twitchApiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${twitchAuthToken}`,
      twitchClientId: `${twitchClientId}`,
    },
  })
    .then((response) =>
      response.json().then((json) => {
        console.log(json);
      })
    )
    .catch((error) => {
      console.error(error);
    });
}
