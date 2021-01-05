import React, { useEffect, memo, useRef}  from 'react';
import './index.css';

const FlatList = ({
    //define defualt prop values
    showsHorizontalScrollIndicator = true,
    inverted = false,
    ListHeaderComponent = null,
    ListFooterComponent = null,
    data=[],
    maxLength = 300,
    onMaxLengthReached = ()=>{},
    onEndReachedThreshold = 0.2,
    onEndReached = ()=>{},
    keyExtractor = (item, index)=>index.toString(),
    ...props
  }) => {

  const flatListRef = useRef();

  if(props.renderItem === null || props.renderItem === undefined){
    throw new Error('renderItem must be defined');
  }

  //function to check for onEndReched condition
  const checkEndReached = (scrollNode) => {
    var threshold = onEndReachedThreshold*scrollNode.clientHeight;
    if(inverted){
      var currentPos = scrollNode.scrollTop;
      if(currentPos < threshold+1){
        onEndReached();
      }
    } else {
      var currentPos = scrollNode.scrollHeight - (scrollNode.scrollTop + scrollNode.clientHeight);
      if(currentPos < threshold+1){
        onEndReached();
      }
    }
  }

  useEffect(() => {
    let scrollNode = flatListRef.current;
    if (!scrollNode) return;

    //Desktop Listeners
    const listenerOnWheel = scrollNode.addEventListener("onWheel", e => {
      checkEndReached(scrollNode);
    }, true);

    //Mobile Touch Listeners
    const listenerTouchStart = scrollNode.addEventListener("touchstart", e => {
      checkEndReached(scrollNode);
    }, true);

    const listenerTouchMove = scrollNode.addEventListener("touchmove", e => {
      checkEndReached(scrollNode);
    }, true);

    const listenerTouchEnd = scrollNode.addEventListener("touchend", e => {
      checkEndReached(scrollNode);
    }, true);

    const listenerTouchCancel = scrollNode.addEventListener("touchcancel", e => {
      checkEndReached(scrollNode);
    }, true);

    if(inverted){
      scrollNode.scrollTop = scrollNode.scrollHeight;
    }

    return () => {
      scrollNode.removeEventListener("onWheel", listenerOnWheel);
      scrollNode.removeEventListener("touchstart", listenerTouchStart);
      scrollNode.removeEventListener("touchmove", listenerTouchMove);
      scrollNode.removeEventListener("touchend", listenerTouchEnd);
      scrollNode.removeEventListener("touchcancel", listenerTouchCancel);
    }
  }); // needs to run any time flatlist mounts

  if(inverted){
    return (
      <div
        className={showsHorizontalScrollIndicator ? 'scrollBarFlatlist' : 'noScrollBarFlatlist'}
        style={{
          ...props.style,
          maxHeight: props.style.height
        }}
        ref={flatListRef}
      >
        {ListFooterComponent}
        {data.reverse().map((item, index) => {
          return (
            <div key={keyExtractor(item, index)}>
              {props.renderItem(item, index)}
            </div>
          )
          }
        )}
        {ListHeaderComponent}
      </div>
    );
  } else {
    return(
      <div
        className={showsHorizontalScrollIndicator ? 'scrollBarFlatlist' : 'noScrollBarFlatlist'}
        style={{
          ...props.style,
          maxHeight: props.style.height
        }}
        ref={flatListRef}
      >
        {ListHeaderComponent}
        {data.map((item, index) => {
            return (
              <div key={keyExtractor(item, index)}>
                {props.renderItem(item, index)}
              </div>
            )
          }
        )}
        {ListFooterComponent}
      </div>
    );
  }
}


export default FlatList;
