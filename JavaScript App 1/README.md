Notes:
    - I have a bad habit of misuing == and === in JavaScript 
    - Right now the server is sending the list many times to client
        - This isn't a problem imo because we're dealing with small amounts of data and the 
          client shouldn't have a big problem with having to run this "costly" list rewrite constantly
          and if it was risky to rewrite the list repeatedly, better for it to be on the client's end
    - I did not take the synchronicity issue on the client side seriously (Refresh every 500ms but don't wait until after whatever other conversation between client and server is done)
        - Actually this might not be a problem because the server handles requests 1 at a time? 