/*
 * @Date: 2020-09-14 20:25:39
 * @LastEditors: kanoyami
 * @LastEditTime: 2020-09-15 16:26:16
 */
const ProtoBufJs = require("protobufjs");
const ROOT = ProtoBufJs.Root.fromJSON(require("../protos.bundle.json"));

module.exports =
  /**
   *
   * @param {Buffer} buffer
   * @param  client
   */
  function ActionHandler(buffer, client) {
    const ZtLiveScActionSignal = ROOT.lookupType("ZtLiveScActionSignal");

    let items = ZtLiveScActionSignal.decode(buffer).item;
    items.forEach((element) => {
      switch (element.signalType) {
        case "CommonActionSignalComment":
          const CommonActionSignalComment = ROOT.lookupType(
            "CommonActionSignalComment"
          );
          element.payload.forEach((e) => {
            let danmaku = CommonActionSignalComment.decode(e);
            client.emit("danmaku", danmaku);
          });
          break;
        case "CommonActionSignalLike":
          const CommonActionSignalLike = ROOT.lookupType(
            "CommonActionSignalLike"
          );
          element.payload.forEach((e) => {
            let like = CommonActionSignalLike.decode(e);
            client.emit("like", like);
          });
          break;
        case "CommonActionSignalUserEnterRoom":
          const CommonActionSignalUserEnterRoom = ROOT.lookupType(
            "CommonActionSignalUserEnterRoom"
          );
          element.payload.forEach((e) => {
            let enters = CommonActionSignalUserEnterRoom.decode(e);
            client.emit("user-enter", enters);
          });
          break;
        case "CommonActionSignalUserFollowAuthor":
          const CommonActionSignalUserFollowAuthor = ROOT.lookupType(
            "CommonActionSignalUserFollowAuthor"
          );
          element.payload.forEach((e) => {
            client.emit("follow", CommonActionSignalUserFollowAuthor.decode(e));
          });
          break;
        case "AcfunActionSignalThrowBanana":
          const AcfunActionSignalThrowBanana = ROOT.lookupType(
            "AcfunActionSignalThrowBanana"
          );
          element.payload.forEach((e) => {
            client.emit("banana", AcfunActionSignalThrowBanana.decode(e));
          });
          break;
        case "CommonActionSignalGift":
          const CommonActionSignalGift = ROOT.lookupType(
            "CommonActionSignalGift"
          );
          element.payload.forEach((e) => {
            let giftDecode = CommonActionSignalGift.decode(e);
            giftDecode.value = giftDecode.value.toNumber()
            giftDecode.giftId = giftDecode.giftId.toNumber()
            const { giftName, webpPicList, pngPicList } = client.getGiftName(giftDecode.giftId)
            giftDecode.giftName = giftName
            giftDecode.webpPicURL = webpPicList[0].url
            giftDecode.pngPicURL = pngPicList[0].url
            client.emit("gift", giftDecode);
          });
          break;
        case "AcfunActionSignalJoinClub":
          let AcfunActionSignalJoinClub = ROOT.lookupType(
            "AcfunActionSignalJoinClub"
          );
          element.payload.forEach((e) => {
            client.emit("join-club", AcfunActionSignalJoinClub.decode(e));
          });
         
          break;
        default:
          // const type = ROOT.lookupType(
          //   element.signalType
          // );
          console.log(element.signalType)
          break;
      }
    });
  };
