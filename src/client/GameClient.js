import React from 'react';

class GameClient {
  GAME_SERVER_HOSTNAME = 'http://localhost:8000/';
  startGameCall = function(height, width) {
    return fetch(this.GAME_SERVER_HOSTNAME + 'start',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        height: height,
        width: width,
      }),
    }).then((response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
      return response.json();
    });
  }

  move = async (dir) => {
    if (!dir) {
      dir = 'straight';
    }
    return fetch(this.GAME_SERVER_HOSTNAME + dir).then((response) => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
    return response.json();
  });
  }
}
export default GameClient;
