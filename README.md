# Dose Dash

Drug calculation practice for nursing students, with a live class game for up to 150 players and a final leaderboard. Runs on Cloudflare Workers with a Durable Object for each live game.

## What is in this folder

| Path | What it does |
| --- | --- |
| `public/index.html` | Solo practice, exam sprint, class battle, worksheets |
| `public/host.html` | Host screen for the live game (open on the projector) |
| `public/play.html` | Student screen for the live game (open on phones) |
| `src/index.js` | Worker: creates games and connects phones to them |
| `src/room.js` | One Durable Object per game: players, questions, marking, scores |
| `src/gen.js` | Question generators and marking, shared with the solo game |
| `wrangler.jsonc` | Cloudflare configuration |

## Put it online (about 10 minutes, free plan is enough)

You need Node.js 18 or newer and a free Cloudflare account.

1. Open a terminal in this folder and install the tools:
   ```
   npm install
   ```
2. Sign in to Cloudflare (a browser window opens):
   ```
   npx wrangler login
   ```
3. Publish:
   ```
   npx wrangler deploy
   ```
   Wrangler prints your web address, for example `https://dose-dash.<your-subdomain>.workers.dev`.

To publish changes later, run `npx wrangler deploy` again.

## Run it on your own computer first (optional)

```
npx wrangler dev
```
Then open http://localhost:8787. Phones on the same Wi-Fi cannot reach `localhost`, so use the deployed address in class.

## Running a live game in class

1. Open `https://<your address>/host` on the projector (or choose "Live class game" on the home page).
2. Choose the field, topics, level, number of questions and time per question, then select **Create the game**.
3. Students go to `<your address>/play` or scan the QR code, then type the 6-digit code and their name.
4. Select **Start the game**. After each question you can reveal the answer, show the leaderboard, then move on.
5. At the end you get the podium, the full leaderboard, a class report and a CSV download of every student's results.

Tips:
- Tap a name in the lobby to remove a player.
- If a phone drops off Wi-Fi or a student refreshes the page, they rejoin automatically with their score.
- If the host laptop refreshes, the host screen reconnects to the same game.
- Games are deleted 2 hours after they end, or 8 hours after they were created.

## Scoring

- Correct answers score 500 to 1000 points: quicker answers score more (the speed bonus can be switched off).
- A streak of correct answers adds 100 points per answer in the streak after the first, up to 500.
- The final question can be set to double points.
- With "Units must be written" on, an answer without its unit is marked wrong.

## Costs

The Workers Free plan includes Durable Objects with SQLite storage. A class of 100 playing a 20-question game uses a small fraction of the free daily allowance. See Cloudflare's Durable Objects pricing page for the current limits.

## Licences

Fonts: Atkinson Hyperlegible Next and Kalam, SIL Open Font License 1.1 (see `public/fonts`). QR code generator: qrcode-generator by Kazuhiko Arase, MIT licence.

For learning and practice only. In practice, always follow the prescription, local policy and the current BNF or BNFC.
