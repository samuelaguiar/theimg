import React, { Component } from "react";
import upload from "../img/icons/upload.svg";
import "../style/home.scss";
import Jimp from "jimp";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

class Home extends Component {
  state = {
    image: null,
    name: null,
    original: null,
    type: null,
    histogramNormalShow: false,
    histogramNormalData: null,
    histogramEqualizedShow: false,
    histogramEqualizedData: null,
    enhacement: {
      inverse: false,
      gamma: false,
      logarithmic: false
    },
    colorModels: {
      hsi: false,
      hsv: false,
      bw: false,
      showColorChannel: false
    },
    filter: {
      mediana: false,
      lowPassDef: false,
      lowPassWei: false,
      laplacian: false
    }
  };

  triggerFileUpload = () => {
    const fileUpload = document.getElementById("upload");
    fileUpload.click();
  };

  imgHandler = e => {
    if (e.target.files.length) {
      const { name, type } = e.target.files[0];
      if (
        type === "image/jpeg" ||
        type === "image/png" ||
        type === "image/bmp"
      ) {
        // console.log(e.target.files[0]);
        // this.setState({ image: e.target.files[0] });
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = e =>
          this.setState({ image: e.target.result, original: e.target.result });
        this.setState({
          name,
          type: type.slice(6),
          enhacement: {
            inverse: false,
            gamma: false,
            logarithmic: false
          },
          histogramNormalShow: false,
          histogramEqualizedShow: false
        });
      }
    }
  };

  fixBinary = bin => {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  };

  saveImage = () => {
    const { image, name, type } = this.state;
    const bin = this.fixBinary(atob(image.split(",")[1]));
    const blob = new Blob([bin], { type: `image/${type}` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  editName = () => {
    const nameInput = document.getElementById("name-input");
    const editBtn = document.getElementById("edit-name-btn");
    const saveBtn = document.getElementById("save-name-btn");

    nameInput.disabled = false;
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
  };

  saveName = () => {
    const nameInput = document.getElementById("name-input");
    const editBtn = document.getElementById("edit-name-btn");
    const saveBtn = document.getElementById("save-name-btn");

    const { type } = this.state;
    const name =
      type === "jpeg" ? nameInput.value + ".jpg" : nameInput.value + type;
    this.setState({ name });

    nameInput.disabled = true;
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
  };

  targetBtnHandler = (btn, text, op) => {
    switch (op) {
      case "APPEND":
        const loader = document.createElement("button");
        loader.classList.add("loader");

        btn.firstChild.data = "";
        btn.appendChild(loader);
        break;
      case "REMOVE":
        btn.lastChild.remove();
        btn.firstChild.data = text;
        break;
      default:
        break;
    }
  };

  toPng = () => {
    const { image, name, type } = this.state;
    const targetBtn = document.getElementById(`${type}Btn`);
    this.targetBtnHandler(targetBtn, type, "APPEND");

    if (image) {
      Jimp.read(image)
        .then(img => {
          img.quality(80);
          img.getBase64(Jimp.MIME_PNG, (err, data) => {
            this.setState({
              image: data,
              original: data,
              name: `${name.slice(0, -4)}.png`,
              type: "png"
            });
          });
          this.targetBtnHandler(targetBtn, type, "REMOVE");
        })
        .catch(err => console.log(err));
    }
  };

  toJpeg = () => {
    const { image, name, type } = this.state;
    const targetBtn = document.getElementById(`${type}Btn`);
    this.targetBtnHandler(targetBtn, type, "APPEND");

    if (image) {
      Jimp.read(image)
        .then(img => {
          img.quality(80);
          img.getBase64(Jimp.MIME_JPEG, (err, data) => {
            this.setState({
              image: data,
              original: data,
              name: `${name.slice(0, -4)}.jpg`,
              type: "jpeg"
            });
          });
          this.targetBtnHandler(targetBtn, type, "REMOVE");
        })
        .catch(err => console.log(err));
    }
  };

  toBmp = () => {
    const { image, name, type } = this.state;
    const targetBtn = document.getElementById(`${type}Btn`);
    this.targetBtnHandler(targetBtn, type, "APPEND");

    if (image) {
      Jimp.read(image)
        .then(img =>
          img.getBase64(Jimp.MIME_BMP, (err, data) => {
            this.setState({
              image: data,
              original: data,
              name: `${name.slice(0, -4)}.bmp`,
              type: "bmp"
            });
            this.targetBtnHandler(targetBtn, type, "REMOVE");
          })
        )
        .catch(err => console.log(err));
    }
  };

  getImage = url => {
    let img = new Image();
    img.src = url;

    let c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;

    let ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, img.width, img.height);
  };

  invert = pixels => {
    const { data } = pixels;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    return pixels;
  };

  gamma = (pixels, gamma) => {
    const { data } = pixels;

    const gammaCorrection = gamma => 1 / gamma;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 * Math.pow(data[i] / 255, gammaCorrection(gamma));
      data[i + 1] = 255 * Math.pow(data[i + 1] / 255, gammaCorrection(gamma));
      data[i + 2] = 255 * Math.pow(data[i + 2] / 255, gammaCorrection(gamma));
    }

    return pixels;
  };

  logarithmic = (pixels, op) => {
    // pixels = grayScale(pixels);

    const { data } = pixels;
    const A = x => x / Math.log(x);

    for (var i = 0; i < data.length; i += 4) {
      data[i] = A(op) * Math.log(data[i] + 1);
      data[i + 1] = A(op) * Math.log(data[i + 1] + 1);
      data[i + 2] = A(op) * Math.log(data[i + 2] + 1);
    }

    return pixels;
  };

  printImage = pixels => {
    let c = document.createElement("canvas");
    c.width = pixels.width;
    c.height = pixels.height;
    let ctx = c.getContext("2d");
    ctx.putImageData(pixels, 0, 0);
    this.setState({ image: c.toDataURL() });
  };

  transfromInverse = () => {
    const btn = document.getElementById("btnInv");
    if (!this.state.enhacement.inverse) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);
    this.printImage(this.invert(pixels));
    this.setState({
      enhacement: { inverse: !this.state.enhacement.inverse }
    });
  };

  triggerGamma = () => {
    const btnGamma = document.getElementById("btnGamma");
    const btnLog = document.getElementById("btnLog");
    const gammaInput = document.getElementById("gamma-input");
    const logInput = document.getElementById("log-input");
    const { gamma, logarithmic } = this.state.enhacement;

    if (!gamma) {
      btnGamma.classList.add("selected");
      gammaInput.classList.remove("hidden");
      if (logarithmic) {
        btnLog.classList.remove("selected");
        logInput.classList.add("hidden");
        this.setState({
          enhacement: { logarithmic: !logarithmic, gamma: !gamma }
        });
      } else {
        this.setState({ enhacement: { gamma: !gamma } });
      }
    } else {
      btnGamma.classList.remove("selected");
      gammaInput.classList.add("hidden");
      this.setState({ enhacement: { gamma: !gamma } });
      if (logarithmic) {
        btnLog.classList.remove("selected");
        logInput.classList.add("hidden");
        this.setState({
          enhacement: { logarithmic: !logarithmic, gamma: !gamma }
        });
      } else {
        this.setState({ enhacement: { gamma: !gamma } });
      }
    }
  };

  handleGamma = e => {
    e.preventDefault();
    const inputGamma = document.getElementById("gammaInput");

    if (inputGamma.value < 0) {
      inputGamma.value = 0;
    }

    if (inputGamma.value > 5) {
      inputGamma.value = 5;
    }

    this.transfromGamma(inputGamma.value);
  };

  transfromGamma = op => {
    const pixels = this.getImage(this.state.original);
    this.printImage(this.gamma(pixels, op));
  };

  triggerLog = () => {
    const btnGamma = document.getElementById("btnGamma");
    const btnLog = document.getElementById("btnLog");
    const gammaInput = document.getElementById("gamma-input");
    const logInput = document.getElementById("log-input");
    const { gamma, logarithmic } = this.state.enhacement;

    if (!logarithmic) {
      btnLog.classList.add("selected");
      logInput.classList.remove("hidden");
      if (gamma) {
        btnGamma.classList.remove("selected");
        gammaInput.classList.add("hidden");
        this.setState({
          enhacement: { logarithmic: !logarithmic, gamma: !gamma }
        });
      } else {
        this.setState({ enhacement: { logarithmic: !logarithmic } });
      }
    } else {
      btnLog.classList.remove("selected");
      logInput.classList.add("hidden");
      this.setState({ enhacement: { logarithmic: !logarithmic } });
      if (gamma) {
        btnGamma.classList.remove("selected");
        gammaInput.classList.add("hidden");
        this.setState({
          enhacement: { logarithmic: !logarithmic, gamma: !gamma }
        });
      } else {
        this.setState({ enhacement: { logarithmic: !logarithmic } });
      }
    }
  };

  handleLog = e => {
    e.preventDefault();
    const inputLog = document.getElementById("logInput");

    if (inputLog.value < 0) {
      inputLog.value = 0;
    }

    if (inputLog.value > 255) {
      inputLog.value = 255;
    }

    this.transfromLogarithmic(inputLog.value);
  };

  transfromLogarithmic = op => {
    const pixels = this.getImage(this.state.original);
    this.printImage(this.logarithmic(pixels, op));
  };

  histogram = pixels => {
    // pixels = grayScale(pixels);

    const { data } = pixels;
    const histogramBW = new Array(255);
    histogramBW.fill(0);

    //BW
    for (var i = 0; i < data.length; i += 4) {
      histogramBW[data[i]]++;
      histogramBW[data[i + 1]]++;
      histogramBW[data[i + 2]]++;
    }

    let json = [];
    let totalPixels = 0;

    histogramBW.forEach(e => (totalPixels += e));

    histogramBW.forEach((e, index) => {
      json.push({ name: index, nivelcinza: (e / totalPixels) * 100 });
    });

    return json;
  };

  showHistogram = () => {
    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);

    this.setState({
      histogramNormalData: this.histogram(pixels),
      histogramNormalShow: !this.state.histogramNormalShow
    });
  };

  showEqualized = () => {
    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);
    let data = this.histogram(pixels);
    let totalPixels = pixels.width * pixels.height;

    // PMF
    for (let i = 0; i < data.length; i++) {
      data[i].nivelcinza = data[i].nivelcinza / totalPixels;
    }

    // CDF
    for (let i = 1; i < data.length; i++) {
      data[i].nivelcinza = data[i].nivelcinza + data[i - 1].nivelcinza;
    }

    // Normalização
    for (let i = 0; i < data.length; i++) {
      data[i].nivelcinza = data[i].nivelcinza * 255;
    }

    this.setState({
      histogramEqualizedShow: !this.state.histogramEqualizedShow,
      histogramEqualizedData: data
    });
  };

  blackWhite = pixels => {
    const { data } = pixels;

    for (var i = 0; i < data.length; i += 4) {
      let r = data[i],
        g = data[i + 1],
        b = data[i + 2];

      data[i] = data[i + 1] = data[i + 2] =
        0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    return pixels;
  };

  toBw = () => {
    const btn = document.getElementById("bwBtn");
    if (!this.state.colorModels.bw) {
      btn.classList.add("selected");
      btn.disabled = true;
      const img = document.getElementById("img");
      const pixels = this.getImage(img.src);
      this.printImage(this.blackWhite(pixels));
      this.setState({
        colorModels: { bw: !this.state.colorModels.bw }
      });
    }
  };

  hsi = pixels => {
    const { data } = pixels;

    for (var j = 0; j < data.length; j += 4) {
      let r = data[j],
        g = data[j + 1],
        b = data[j + 2];

      const i = (r + g + b) / 3;
      let s = 1 - 3 * (Math.min(r, g, b) / (r + g + b));
      let h = 0;

      if (s < 0.00001) {
        s = 0;
      } else if (s > 0.99999) {
        s = 1;
      }

      if (s !== 0) {
        h =
          (0.5 * (r - g + (r - b))) /
          Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
        h = Math.acos(h);
      }

      if (b > g) {
        h = (360 * 3.14159265) / 180.0 - h;
      }

      data[j + 2] = (h * 180) / 3.14159265;
      data[j + 1] = s * 100;
      data[j] = i;
    }

    return pixels;
  };

  toHSI = () => {
    const btn = document.getElementById("hsiBtn");
    if (!this.state.colorModels.hsi) {
      btn.classList.add("selected");
      btn.disabled = true;
      const img = document.getElementById("img");
      const pixels = this.getImage(img.src);
      this.printImage(this.hsi(pixels));
      this.setState({
        colorModels: { hsi: !this.state.colorModels.hsi }
      });
    }
  };

  hsv = pixels => {
    const { data } = pixels;

    for (var j = 0; j < data.length; j += 4) {
      let r = data[j],
        g = data[j + 1],
        b = data[j + 2];

      const v = Math.max(r, g, b);
      let s,
        h = 0;

      if (v !== 0) {
        s = (v - Math.min(r, g, b)) / v;
      }

      if (v === r) {
        h = (60 * (g - b)) / (v - Math.min(r, g, b));
      }

      if (v === g) {
        h = 120 + (60 * (b - r)) / (v - Math.min(r, g, b));
      }

      if (v === b) {
        h = 240 + (60 * (r - b)) / (v - Math.min(r, g, b));
      }

      if (h < 0) {
        h += 360;
      }

      data[j] = h;
      data[j + 1] = s;
      data[j + 2] = v;
    }

    return pixels;
  };

  toHSV = () => {
    const btn = document.getElementById("hsvBtn");
    if (!this.state.colorModels.hsv) {
      btn.classList.add("selected");
      btn.disabled = true;
      const img = document.getElementById("img");
      const pixels = this.getImage(img.src);
      this.printImage(this.hsv(pixels));
      this.setState({
        colorModels: { hsv: !this.state.colorModels.hsv }
      });
    }
  };

  colorChannels = container => {
    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);

    let redCanvas = document.createElement("canvas");
    redCanvas.width = pixels.width;
    redCanvas.height = pixels.height;
    let redCtx = redCanvas.getContext("2d");
    let redImgData = redCtx.createImageData(pixels.width, pixels.height);

    let greenCanvas = document.createElement("canvas");
    greenCanvas.width = pixels.width;
    greenCanvas.height = pixels.height;
    let greenCtx = greenCanvas.getContext("2d");
    let greenImgData = greenCtx.createImageData(pixels.width, pixels.height);

    let blueCanvas = document.createElement("canvas");
    blueCanvas.width = pixels.width;
    blueCanvas.height = pixels.height;
    let blueCtx = blueCanvas.getContext("2d");
    let blueImgData = blueCtx.createImageData(pixels.width, pixels.height);

    const { data } = pixels;

    for (var i = 0; i < data.length; i += 4) {
      redImgData.data[i] = data[i];
      redImgData.data[i + 1] = data[i];
      redImgData.data[i + 2] = data[i];
      redImgData.data[i + 3] = 255;

      greenImgData.data[i] = data[i + 1];
      greenImgData.data[i + 1] = data[i + 1];
      greenImgData.data[i + 2] = data[i + 1];
      greenImgData.data[i + 3] = 255;

      blueImgData.data[i] = data[i + 2];
      blueImgData.data[i + 1] = data[i + 2];
      blueImgData.data[i + 2] = data[i + 2];
      blueImgData.data[i + 3] = 255;
    }

    redCtx.putImageData(redImgData, 0, 0);
    greenCtx.putImageData(greenImgData, 0, 0);
    blueCtx.putImageData(blueImgData, 0, 0);

    container.appendChild(redCanvas);
    container.appendChild(greenCanvas);
    container.appendChild(blueCanvas);
  };

  showColorChannel = () => {
    const btn = document.getElementById("showColorChannelsBtn");
    const container = document.getElementById("colorLayers");

    if (!this.state.colorModels.showColorChannel) {
      btn.classList.add("selected");
      container.classList.remove("hidden");
      this.colorChannels(container);
    } else {
      btn.classList.remove("selected");
      container.classList.add("hidden");
      container.innerHTML = "";
    }

    this.setState({
      colorModels: {
        showColorChannel: !this.state.colorModels.showColorChannel
      }
    });
  };

  // AO INVES DE ALTERAR IMAGEM ORIGINAL, CRIAR OUTRO VETOR NO STATE

  convolution = (pixels, weights) => {
    let side = Math.round(Math.sqrt(weights.length)),
      halfSide = Math.floor(side / 2),
      src = pixels.data,
      canvasWidth = pixels.width,
      canvasHeight = pixels.height,
      temporaryCanvas = document.createElement("canvas"),
      temporaryCtx = temporaryCanvas.getContext("2d"),
      outputData = temporaryCtx.createImageData(canvasWidth, canvasHeight);

    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        let dstOff = (y * canvasWidth + x) * 4,
          sumReds = 0,
          sumGreens = 0,
          sumBlues = 0;

        for (let kernelY = 0; kernelY < side; kernelY++) {
          for (let kernelX = 0; kernelX < side; kernelX++) {
            let currentKernelY = y + kernelY - halfSide,
              currentKernelX = x + kernelX - halfSide;

            if (
              currentKernelY >= 0 &&
              currentKernelY < canvasHeight &&
              currentKernelX >= 0 &&
              currentKernelX < canvasWidth
            ) {
              let offset = (currentKernelY * canvasWidth + currentKernelX) * 4,
                weight = weights[kernelY * side + kernelX];

              sumReds += src[offset] * weight;
              sumGreens += src[offset + 1] * weight;
              sumBlues += src[offset + 2] * weight;
            }
          }
        }

        outputData.data[dstOff] = sumReds;
        outputData.data[dstOff + 1] = sumGreens;
        outputData.data[dstOff + 2] = sumBlues;
        outputData.data[dstOff + 3] = 255;
      }
    }
    return outputData;
  };

  filterLowPassDef = () => {
    const btn = document.getElementById("lowPassDefBtn");
    const input = document.getElementById("lowPassDef-input");

    if (!this.state.filter.lowPassDef) {
      btn.classList.add("selected");
      input.classList.remove("hidden");
    } else {
      btn.classList.remove("selected");
      input.classList.add("hidden");
    }

    this.setState({
      filter: { lowPassDef: !this.state.filter.lowPassDef }
    });
  };

  handleLowPassDef = () => {
    const lowPassDefInput = document.getElementById("lowPassDefInput");

    const p = lowPassDefInput.value;
    let k = 1 / (p * p);
    let operator = [];
    for (let i = 0; i < p * p; i++) {
      operator.push(k);
    }

    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);
    this.printImage(this.convolution(pixels, operator));

    const btn = document.getElementById("lowPassDefBtn");
    const input = document.getElementById("lowPassDef-input");
    btn.classList.remove("selected");
    input.classList.add("hidden");

    this.setState({
      filter: { lowPassDef: !this.state.filter.lowPassDef }
    });
  };

  filterLowPassWei = () => {
    const btn = document.getElementById("lowPassWeiBtn");
    const input = document.getElementById("lowPassWei-input");

    if (!this.state.filter.lowPassWei) {
      btn.classList.add("selected");
      input.classList.remove("hidden");
    } else {
      btn.classList.remove("selected");
      input.classList.add("hidden");
    }

    this.setState({
      filter: { lowPassWei: !this.state.filter.lowPassWei }
    });
  };

  handleLowPassWei = () => {
    const lowPassWeiInput = document.getElementById("lowPassWeiInput");

    const p = lowPassWeiInput.value;
    let operator = [
      1 / p,
      2 / p,
      1 / p,
      2 / p,
      4 / p,
      2 / p,
      1 / p,
      2 / p,
      1 / p
    ];

    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);
    this.printImage(this.convolution(pixels, operator));

    const btn = document.getElementById("lowPassWeiBtn");
    const input = document.getElementById("lowPassWei-input");
    btn.classList.remove("selected");
    input.classList.add("hidden");

    this.setState({
      filter: { lowPassWei: !this.state.filter.lowPassWei }
    });
  };

  filterLaplacian = () => {
    let operator = [0, -1, 0, -1, 4, -1, 0, -1, 0];

    const img = document.getElementById("img");
    const pixels = this.getImage(img.src);
    this.printImage(this.convolution(pixels, operator));
  };

  render() {
    const {
      image,
      name,
      type,
      histogramNormalShow,
      histogramNormalData,
      histogramEqualizedShow,
      histogramEqualizedData
    } = this.state;

    return (
      <div className="max-w content home">
        <input
          type="file"
          name="upload"
          id="upload"
          hidden
          onChange={this.imgHandler}
        />
        {!image ? (
          <div className="max-w home">
            <img
              src={upload}
              className="icon"
              alt="upload"
              onClick={this.triggerFileUpload}
            />
            <h1>Para iniciar, abra uma imagem</h1>
          </div>
        ) : (
          <div className="flex flex-wrap justify-content-space-around max-w">
            <div className="flex flex-column">
              <img src={image} className="edit" alt="img" id="img" />
              <div className="flex line">
                <div>
                  <h3>Nome</h3>
                  <span>{name.replace(/\.[^/.]+$/, "")}</span>
                </div>
                <div>
                  <h3>Tipo</h3>
                  <span>{type}</span>
                </div>
              </div>
              <div className="flex line">
                <button onClick={this.saveImage}>Salvar</button>
                <button onClick={this.triggerFileUpload}>Nova imagem</button>
              </div>
            </div>
            <div className="flex flex-column options">
              <div className="name-container">
                <h3>Nome</h3>
                <div>
                  <input
                    type="text"
                    name="name"
                    id="name-input"
                    value={name.replace(/\.[^/.]+$/, "")}
                    onChange={e => this.setState({ name: e.target.value })}
                    disabled
                  />
                </div>
                <button
                  className="btn-container"
                  id="edit-name-btn"
                  onClick={this.editName}
                >
                  Editar
                </button>
                <button
                  className="btn-container hidden"
                  id="save-name-btn"
                  onClick={this.saveName}
                >
                  Salvar
                </button>
              </div>
              <div className="converter-container">
                <h3>Tipo da imagem</h3>
                <div className="line flex flex-wrap">
                  <button
                    id="pngBtn"
                    onClick={this.toPng}
                    disabled={type === "png" ? true : false}
                  >
                    PNG
                  </button>
                  <button
                    id="jpegBtn"
                    onClick={this.toJpeg}
                    disabled={type === "jpeg" ? true : false}
                  >
                    JPEG
                  </button>
                  <button
                    id="bmpBtn"
                    onClick={this.toBmp}
                    disabled={type === "bmp" ? true : false}
                  >
                    BMP
                  </button>
                </div>
              </div>
              <div className="enhancement-container">
                <h3>Realce</h3>
                <div className="line">
                  <button onClick={this.triggerLog} id="btnLog">
                    Logarítmico
                  </button>
                  <button onClick={this.triggerGamma} id="btnGamma">
                    Gama
                  </button>
                  <button onClick={this.transfromInverse} id="btnInv">
                    Inversa
                  </button>
                </div>
                <div id="log-input" className="hidden">
                  <h4>Digite um valor entre 0 e 255</h4>
                  <div className="input-inline-container flex">
                    <input
                      type="number"
                      name="log"
                      id="logInput"
                      defaultValue="0"
                    />
                    <button onClick={this.handleLog}>Realçar</button>
                  </div>
                </div>
                <div id="gamma-input" className="hidden">
                  <h4>Digite um valor entre 0 e 5</h4>
                  <div className="input-inline-container flex">
                    <input
                      type="number"
                      name="gamma"
                      id="gammaInput"
                      defaultValue="1"
                    />
                    <button onClick={this.handleGamma}>Realçar</button>
                  </div>
                </div>
              </div>
              <div className="histogram-section">
                <h3>Histograma</h3>
                <div className="line">
                  <button id="btnShowHistogram" onClick={this.showHistogram}>
                    Exibir
                  </button>
                  <button
                    id="btnEqualizarHistograma"
                    onClick={this.showEqualized}
                  >
                    Equalizar
                  </button>
                  <button id="btnEspecificarHistograma">Especificar</button>
                  <button id="btnCompararHistograma">Comparar</button>
                </div>
                <div id="histogram-container">
                  {histogramNormalShow ? (
                    <BarChart
                      width={450}
                      height={300}
                      data={histogramNormalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="nivelcinza" fill="#ccc" />
                    </BarChart>
                  ) : null}
                  {histogramEqualizedShow ? (
                    <BarChart
                      width={450}
                      height={300}
                      data={histogramEqualizedData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="nivelcinza" fill="#ccc" />
                    </BarChart>
                  ) : null}
                </div>
                <div className="color-models-container">
                  <h3>Modelos de cor</h3>
                  <div className="line flex flex-wrap">
                    <button id="hsvBtn" onClick={this.toHSV}>
                      HSV
                    </button>
                    <button id="hsiBtn" onClick={this.toHSI}>
                      HSI
                    </button>
                    <button id="bwBtn" onClick={this.toBw}>
                      P/B
                    </button>
                    <button
                      id="showColorChannelsBtn"
                      onClick={this.showColorChannel}
                    >
                      Exibir Canais de Cor
                    </button>
                  </div>
                  <div id="colorLayers" className="flex flex-wrap hidden" />
                </div>
                <div className="color-models-container">
                  <h3>Filtros espaciais</h3>
                  <div className="line flex flex-wrap">
                    <button id="medianaBtn" onClick={this.filterMediana}>
                      Mediana
                    </button>
                    <button id="lowPassDefBtn" onClick={this.filterLowPassDef}>
                      Média
                    </button>
                    <button id="lowPassWeiBtn" onClick={this.filterLowPassWei}>
                      Média Ponderada
                    </button>
                    <button id="laplacianBtn" onClick={this.filterLaplacian}>
                      Laplaciano
                    </button>
                  </div>
                  <div id="lowPassDef-input" className="hidden">
                    <h4>Digite um valor</h4>
                    <div className="input-inline-container flex">
                      <input
                        type="number"
                        name="lowPassDef"
                        id="lowPassDefInput"
                        defaultValue="0"
                      />
                      <button onClick={this.handleLowPassDef}>
                        Aplicar filtro
                      </button>
                    </div>
                  </div>
                  <div id="lowPassWei-input" className="hidden">
                    <h4>Digite um valor</h4>
                    <div className="input-inline-container flex">
                      <input
                        type="number"
                        name="lowPassWei"
                        id="lowPassWeiInput"
                        defaultValue="0"
                      />
                      <button onClick={this.handleLowPassWei}>
                        Aplicar filtro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
