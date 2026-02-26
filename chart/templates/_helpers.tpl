{{- define "adoras-website.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{- define "adoras-website.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride -}}
{{- else -}}
{{- include "adoras-website.name" . -}}
{{- end -}}
{{- end -}}
