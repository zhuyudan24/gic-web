const clone = ( ()=>{
  const s = /str|num|boo|und/, f = /fun/, m = /date|rege/i;

  return json =>{
    let t, i, r;

    t = typeof json;

    if( s.test( t ) || !json )
      return json;

    if( f.test( t ) )
      return new Function( 'return ' + json.toString() )();

    if( m.test( json.constructor ) )
      return new json.constructor( json.valueOf() );

    r = 'length' in json ? [] : {};

    for( i in json )
      if( json.hasOwnProperty( i ) )
        r[ i ] = clone( json[ i ] );

    return r;
  }

} )();

export default clone;