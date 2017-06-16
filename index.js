const SHA3   = require('sha3');

class merkleTree {
  constructor(input) {
    const self = this;

    self.root  = null;
    self.tree  = {};
    self.depth = Math.ceil(Math.log2(input.length));

    //Now we can create the tree
    for (let x = self.depth; x >= 0; x--) {
      // verify that the merkle tree is even in number
      // if not, the last one will have to merge with itself
      if (input.length % 2 !== 0)
        input.push(input[input.length - 1]);

      if (x === self.depth) {
        input = input.map(doubleSha3);
      } else {
        let first;
        input = input.map((hash, i) => {
            if (i % 2 === 0) {
              first = hash;
              return null
            } else {
              return doubleSha3(first + hash);
            }
          })
          .filter((hash) => { return hash !== null });
      }
      self.tree[x] = input;
    }
    // The root is at the top
    self.root = self.tree[0][0];
  }

  digest() {
    return this.root;
  }
}

function doubleSha3(payload) {
  if (typeof payload === 'string')
    payload = Buffer.from(payload);

  return new SHA3.SHA3Hash()
                  .update(
                    new SHA3.SHA3Hash()
                            .update(payload)
                            .digest()
                  )
                  .digest('hex');
}

module.exports = merkleTree
