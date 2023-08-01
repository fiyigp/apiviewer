$(document).ready(function () {
	$(document).on("click", "#addParam", function () {
		var paramName = $("#param").val();
		var paramType = $("#type").val();
		
		if (paramName == "") {
			alert("Ingresa el nombre del parámetro");
			return;
		}
		
		var idRamdom = makeSTR(5);
		var inputHtml = '<div class="input-group row mx-0 mb-3" id="' + idRamdom + '">';
		inputHtml +=  '<input class="form-control col-md-auto" data-input="" value="' + paramName + '" disabled/>';
		inputHtml += '<input type="' + paramType + '" class="form-control col-md-auto" data-name="' + paramName + '">';
		inputHtml += '<button class="btn btn-primary col-md-auto" data-edit="" data-id="' + idRamdom + '"><i class="bi bi-pencil-square"></i></button>';
		inputHtml += '<button class="btn btn-primary d-none col-md-auto" data-save="" data-id="' + idRamdom + '"><i class="bi bi-check2-square"></i></button>';
		inputHtml += '<button class="btn btn-danger col-md-auto" data-remove="" data-id="' + idRamdom + '"><i class="bi bi-trash-fill"></i></button>';
		inputHtml += '</div>';
		
		$("[data-ui='form']").append(inputHtml);
		$("#param").val("");
	});
	
	$(document).on("click", "[data-edit]", function () {
		var idElement = "#" + $(this).data("id");
		var inputParamName = $(idElement).find("[data-input]");
		$(inputParamName).prop("disabled", false);
		$(idElement).find("[data-edit]").addClass("d-none");
		$(idElement).find("[data-save]").removeClass("d-none");
	});
	
	$(document).on("click", "[data-save]", function () {
		var idElement = "#" + $(this).data("id");
		var inputParamName = $(idElement).find("[data-input]");
		var inputParam = $(idElement).find("[data-name]");
		$(inputParamName).prop("disabled", true);
		$(inputParam).data("name", $(inputParamName).val());
		$(idElement).find("[data-save]").addClass("d-none");
		$(idElement).find("[data-edit]").removeClass("d-none");
	});
	
	$(document).on("click", "[data-remove]", function () {
		var idElement = $(this).data("id");
		$("#" + idElement).remove();
	});
	
	$("[data-ui='form']").on('DOMSubtreeModified', function() {
		if ($(this).length > 0) {
			$("#sendRequest").removeClass("d-none");
		} else {
			$("#sendRequest").addClass("d-none");
		}
	});
	
	$(document).on("click", "#sendRequest", function () {
		var urlRequest = $("#url").val();
		var pathRequest = $("#path").val();
		var methodRequest = $("#method").val();
		
		$("[data-loader]").css("display", "flex");
		
		if (urlRequest == "") {
			alert("Ingresa la URL");
			return;
		}
		
		if (pathRequest == "") {
			alert("Ingresa la ruta");
			return;
		}
		
		pathRequest += "/";
		
		if (methodRequest == "GET") {
			pathRequest += "?";
		}
		
		var dataRequest = new FormData();
		
		$("[data-ui='form'] input[data-name]").each(function () {
			var currentField = $(this).data("name");
			var currentValue = $(this).val();
			var currenType = $(this).prop("type");
			
			if (currenType == "file") {
				if (methodRequest == "GET") {
					alert("El método GET no permite enviar archivos cambie a POST");
					return;
				}
				
				if (currentValue == "") {
					alert("Selecciona el archivo para el parámetro " + currentField);
					return;
				}
				
				var  currentFile = $(this)[0].files[0];
				
				dataRequest.append(currentField, currentFile);
			} else {
				if  (methodRequest == "GET") {
					pathRequest += currentField + "=" + currentValue + "&";
				}
				
				if  (methodRequest == "POST") {
					dataRequest.append(currentField, currentValue);
				}
			}
		});
		
		$.ajax({
			url: "https://" + urlRequest + "/" + pathRequest,
			type: methodRequest,
			data: dataRequest,
			dataType: 'json',
			crossDomain: true,
			contentType: false,
			processData: false,
			success: function(result) {
				new JsonViewer({value:{result}}).render('#json-viewer');
				$("[data-loader]").fadeOut();
			},
			error: function(e) {
				var error = {"fail": "fail"};
				new JsonViewer({value:{error}}).render('#json-viewer');
				$("[data-loader]").fadeOut();
			},
		});
	});
});

function makeSTR(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}