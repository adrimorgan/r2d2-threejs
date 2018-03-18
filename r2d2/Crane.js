
/// The Crane class
/**
 * @author FVelasco
 * 
 * @param parameters = {
 *      craneHeight: <float>,
 *      craneWidth : <float>,
 *      material: <Material>
 * }
 */



class Crane extends THREE.Object3D {
  
  constructor (parameters) {
    super();
    
    // If there are no parameters, the default values are used
    
    this.craneHeight = (parameters.craneHeight === undefined ? 30 : parameters.craneHeight);
    this.craneWidth  = (parameters.craneWidth === undefined ? 45 : parameters.craneWidth);
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70}) : parameters.material);
          
    // With these variables, the posititon of the hook is set
    this.angle           = 0;
    this.distance        = this.craneWidth / 2;
    this.height          = this.craneHeight / 2;
    
    // Height of different parts
    this.baseHookHeight = this.craneHeight/100;
    this.trolleyHeight  = this.craneHeight/20;
    
    // Objects for operating with the crane
    this.base         = null;
    this.jib          = null;
    this.trolley      = null;
    this.string       = null;
    // The string length is 1 at the beginning. So, the current length is the scale factor
    this.stringLength = 1;
    this.hook         = null;
    this.box          = null;
    this.feedBack     = null;
    
    // Limits
    this.distanceMin  = this.craneWidth/7;
    this.distanceMax  = 0.75*this.craneWidth;
    this.heightMin    = 0;
    this.heightMax    = 0.9*this.craneHeight;
    
    this.base = this.createBase();
    // A way of feedback, a red jail will be visible around the crane when a box is taken by it
    this.feedBack = new THREE.BoxHelper (this.base, 0xFF0000);
    this.feedBack.visible = false;
    this.add (this.base);
    this.add (this.feedBack);
  }
  
  // Private methods
  
  /// It computes the length of the string
  computeStringLength () {
    // stringLenght = base height + crane height - trolley height - hook height - height of the hook to the ground. So,
    // stringLength = baseHookHeight + craneHeight - trolleyHeight - baseHookHeight - height;
    return this.craneHeight - this.trolleyHeight - this.height;
  }
  
  /// It creates the base and adds the mast to the base
  createBase () {
    var base = new THREE.Mesh (
      new THREE.CylinderGeometry (this.craneWidth/10, this.craneWidth/10, this.baseHookHeight, 16, 1), 
                               this.material);
    base.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.baseHookHeight/2, 0));
    base.castShadow = true;
    base.autoUpdateMatrix = false;
    base.add(this.createMast());
    return base;
  }
  
  /// It creates the mast and adds the jib to the mast
  createMast () {
    var mast = new THREE.Mesh (
      new THREE.CylinderGeometry (this.craneWidth/20, this.craneWidth/20, this.craneHeight, 16, 8), this.material);
    mast.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.craneHeight/2, 0));
    mast.castShadow = true;
    mast.position.y = this.baseHookHeight;
    mast.autoUpdateMatrix = false;
    mast.updateMatrix();
    mast.add(this.createJib());
    return mast;
  }
  
  /// It creates the jib, and adds the trolley-string-hook group to the jib
  createJib () {
    this.jib = new THREE.Mesh (
      new THREE.BoxGeometry (this.craneWidth, this.craneWidth/10, this.craneWidth/10),
                          this.material);
    this.jib.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0.3*this.craneWidth, this.craneWidth/20, 0));
    this.jib.castShadow = true;
    this.jib.position.y = this.craneHeight;
    this.jib.rotation.y = this.angle ;
    this.jib.add (this.createTrolleyStringHook());
    return this.jib;
  }
  

  /// It creates the trolley, string and hook
  createTrolleyStringHook () {
    this.trolley = new THREE.Mesh (
      new THREE.BoxGeometry (this.craneWidth/10, this.trolleyHeight, this.craneWidth/10),
                              this.material);
    this.trolley.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.trolleyHeight/2, 0));
    this.trolley.castShadow = true;
    this.trolley.position.y = -this.trolleyHeight;
    this.trolley.position.x = this.distanceMin;
    
    this.string = new THREE.Mesh (
      new THREE.CylinderGeometry (this.craneWidth/100, this.craneWidth/100, 1), this.material);
    this.string.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -0.5, 0));
    this.string.castShadow = true;
    this.stringLength = this.computeStringLength();
    this.string.scale.y = this.stringLength;
    this.trolley.add (this.string);
    
    this.hook = new THREE.Mesh (
      new THREE.CylinderGeometry (this.craneWidth/40, this.craneWidth/40, this.baseHookHeight, 16, 1),
                           this.material);
    this.hook.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -this.baseHookHeight/2, 0));
    this.hook.castShadow = true;
    this.hook.position.y = -this.stringLength;
    this.trolley.add (this.hook);
    
    return this.trolley;
  }
  
  /// It sets the angle of the jib
  /**
   * @param anAngle - The angle of the jib
   */
  setJib (anAngle) {
    this.angle  = anAngle;
    this.jib.rotation.y = this.angle ;
    if (this.feedBack.visible) {
      this.feedBack.update();
    }
  }
  
  /// It sets the distance of the trolley from the mast
  /**
   * @param aDistance - The distance of the trolley from the mast
   */
  setTrolley (aDistance) {
    if (this.distanceMin <= aDistance && aDistance <= this.distanceMax) {
      this.distance = aDistance;
      this.trolley.position.x = this.distance;
    }
  }
  
  /// It sets the distance of the hook from the bottom of the base
  /**
   * @param aHeight - The distance of the hook from the bottom of the base
   */
  setHook (aHeight) {
    if (this.heightMin <= aHeight && aHeight <= this.heightMax) {
      this.height = aHeight;
      this.stringLength = this.computeStringLength ()
      this.string.scale.y = this.stringLength;
      this.hook.position.y = -this.stringLength;
    }
  }

  /// It makes the crane feedback visible or not
  /**
   * @param onOff - Visibility (true or false)
   */
  setFeedBack (onOff) {
    this.feedBack.visible = onOff;
  }
  
  /// It sets the hook according to
  /**
   * @param anAngle - The angle of the jib
   * @param aDistance - The distance of the trolley from the mast
   * @param aHeight - The distance of the hook from the bottom of the base
   */
  setHookPosition (anAngle, aDistance, aHeight) {
    this.setJib (anAngle);
    this.setTrolley (aDistance);
    this.setHook (aHeight);
  }
  
  /// It returns the position of the hook
  /**
   * @param world - Whether the returned position is referenced to the World Coordinates System (Crane.WORLD) or is referenced to the crane position (Crane.LOCAL)
   * @return A Vector3 with the asked position
   */
  getHookPosition (world) {
    if (world === undefined)
      world = Crane.WORLD;
    var hookPosition = new THREE.Vector3();
    hookPosition.setFromMatrixPosition (this.hook.matrixWorld);
    hookPosition.y -= this.baseHookHeight;
    if (world === Crane.LOCAL) {
      var cranePosition = new THREE.Vector3();
      cranePosition.setFromMatrixPosition (this.matrixWorld);
      hookPosition.sub (cranePosition);
    }
    return hookPosition;
  }
  
  /// The crane takes a box
  /**
   * @param aBox - The box to be taken
   * @return The new height of the hook, on the top of the box. Zero if no box is taken
   */
  takeBox (aBox) { 
    if (this.box === null) {
      this.setFeedBack(true);
      this.box = aBox;
      var newHeight = this.box.position.y + this.box.geometry.parameters.height;
      this.heightMin = this.box.geometry.parameters.height;
      this.box.position.x = 0;
      this.box.position.y = -this.box.geometry.parameters.height-this.baseHookHeight;
      this.box.position.z = 0;
      this.box.rotation.y -= this.jib.rotation.y;
      this.hook.add (this.box);
      return newHeight;
    }
    return 0;
  }
  
  /// The crane drops its taken box
  /**
   * @return The dropped box, or null if no box is dropped.
   */
  dropBox () {
    if (this.box !== null) {
      this.setFeedBack(false);
      var theBox = this.box;
      this.hook.remove (this.box);
      this.box = null;
      theBox.rotation.y += this.jib.rotation.y;
      this.heightMin = 0;
      return theBox;
    } else
      return null;
  }
}

// class variables
Crane.WORLD = 0;
Crane.LOCAL = 1;
